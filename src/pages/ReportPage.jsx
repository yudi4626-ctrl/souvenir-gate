// src/pages/ReportPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ReportPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [souvenirs, setSouvenirs] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Ambil data event
      const { data: eventData } = await supabase.from('events').select('*').eq('id', eventId).single();
      setEvent(eventData);

      // 2. Ambil data souvenir
      const { data: souvenirData } = await supabase.from('souvenirs').select('*').eq('event_id', eventId);
      setSouvenirs(souvenirData || []);

      // 3. Ambil data distribusi (pencatatan keluar)
      const { data: distData } = await supabase.from('distributions').select('souvenir_id, qty').eq('event_id', eventId);
      setDistributions(distData || []);
      
      setLoading(false);
    };
    fetchData();
  }, [eventId]);

  // Hitung total distribusi per souvenir
  const getDistributedQty = (souvenirId) => {
    return distributions
      .filter(d => d.souvenir_id === souvenirId)
      .reduce((sum, d) => sum + d.qty, 0);
  };

  // Generate Narasi Otomatis
  const generateNarrative = () => {
    if (souvenirs.length === 0) return "Belum ada data souvenir untuk event ini.";
    
    let totalDistributed = 0;
    let totalRemaining = 0;
    let fastestSoldOut = null;
    let maxDistributed = 0;

    souvenirs.forEach(s => {
      const dist = getDistributedQty(s.id);
      totalDistributed += dist;
      totalRemaining += s.stock;

      // Cari yang paling banyak keluar (proxy untuk paling laris)
      if (dist > maxDistributed) {
        maxDistributed = dist;
        fastestSoldOut = s;
      }
    });

    const totalInitial = totalDistributed + totalRemaining;
    const percentage = totalInitial > 0 ? Math.round((totalDistributed / totalInitial) * 100) : 0;

    let narrative = `Pada event ${event?.name || 'ini'}, total ${totalDistributed} dari ${totalInitial} souvenir telah dibagikan (${percentage}% terdistribusi). `;
    
    if (fastestSoldOut && maxDistributed > 0) {
      narrative += `Souvenir paling laris adalah "${fastestSoldOut.name}" dengan ${maxDistributed} pcs keluar. `;
    }
    
    if (totalRemaining > 0) {
      narrative += `Saat ini tersisa ${totalRemaining} pcs souvenir yang tidak terpakai.`;
    } else {
      narrative += `Semua souvenir telah habis terdistribusi!`;
    }

    return narrative;
  };

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nama Souvenir,Stok Awal,Terkeluar,Sisa Stok\n";

    souvenirs.forEach(s => {
      const dist = getDistributedQty(s.id);
      const initial = dist + s.stock;
      csvContent += `"${s.name}",${initial},${dist},${s.stock}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_${event?.slug || 'souvenir'}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return <div className="p-10 text-center">Memuat laporan...</div>;
  if (!event) return <div className="p-10 text-center">Event tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📊 Laporan: {event.name}</h1>
          <Link to="/admin" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">← Kembali</Link>
        </div>

        {/* Narasi */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <h3 className="font-bold text-blue-800 mb-1">Ringkasan Eksekutif</h3>
          <p className="text-blue-900">{generateNarrative()}</p>
        </div>

        {/* Tombol Export */}
        <div className="mb-4 flex justify-end">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
          >
            📥 Download CSV
          </button>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Nama Souvenir</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Stok Awal</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Terkeluar</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Sisa Stok</th>
              </tr>
            </thead>
            <tbody>
              {souvenirs.map(s => {
                const dist = getDistributedQty(s.id);
                const initial = dist + s.stock;
                return (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{s.name}</td>
                    <td className="p-4 text-center text-gray-600">{initial}</td>
                    <td className="p-4 text-center text-blue-600 font-bold">{dist}</td>
                    <td className={`p-4 text-center font-bold ${s.stock === 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {s.stock} {s.stock === 0 && '🔥'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {souvenirs.length === 0 && <p className="p-8 text-center text-gray-500">Tidak ada data.</p>}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;