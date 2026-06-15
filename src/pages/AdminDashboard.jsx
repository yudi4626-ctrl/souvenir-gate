// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const AdminDashboard = () => {
  const [souvenirs, setSouvenirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStok, setTotalStok] = useState(0);
  const [latestEventId, setLatestEventId] = useState(null);
  const [showQR, setShowQR] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', stock: '', image_url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
    fetchLatestEvent();
  }, []);

  const fetchLatestEvent = async () => {
    const { data } = await supabase.from('events').select('id').order('created_at', { ascending: false }).limit(1).single();
    if (data) setLatestEventId(data.id);
  };

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('souvenirs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setSouvenirs(data || []);
      setTotalStok(data ? data.reduce((acc, curr) => acc + curr.stock, 0) : 0);
    } catch (err) {
      console.error("Gagal load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Fungsi Tambah Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.stock || !latestEventId) {
      setMessage({ type: 'error', text: '⚠️ Lengkapi nama & stok' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('souvenirs').insert([{
      event_id: latestEventId,
      name: formData.name,
      stock: parseInt(formData.stock),
      image_url: formData.image_url || ''
    }]);
    
    if (error) {
      setMessage({ type: 'error', text: ' Gagal: ' + error.message });
    } else {
      setMessage({ type: 'success', text: '✅ Souvenir berhasil ditambahkan!' });
      setFormData({ name: '', stock: '', image_url: '' }); // Reset form
      fetchData(); // Refresh tabel
    }
    setSubmitting(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // 2. Fungsi Hapus Data (BARU)
  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus "${name}"?`)) {
      const { error } = await supabase.from('souvenirs').delete().eq('id', id);
      if (!error) {
        fetchData(); // Refresh tabel setelah hapus
      } else {
        alert("Gagal menghapus data.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
<div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold text-gray-800">️ Admin Dashboard</h1>
  <div className="flex gap-2">
    {/* Tombol QR Baru */}
    <button 
      onClick={() => setShowQR(!showQR)}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
    >
      📱 {showQR ? 'Tutup QR' : 'Bagikan Akses'}
    </button>
    
    <Link 
      to="/" 
      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
    >
      ← Lapangan
    </Link>
  </div>
</div>

{/* Modal QR Code (Muncul jika showQR true) */}
{showQR && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Scan untuk Masuk</h3>
      <p className="text-sm text-gray-500 mb-6">Arahkan kamera HP ke kode ini</p>
      
      <div className="bg-white p-4 rounded-xl border-2 border-gray-100 inline-block">
        {/* Generate QR untuk URL dasar (tanpa /admin) */}
        <QRCodeSVG value={window.location.origin} size={200} />
      </div>

      <div className="mt-6">
        <button 
          onClick={() => setShowQR(false)}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
)}

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Jenis</p>
            <p className="text-2xl font-bold text-gray-800">{souvenirs.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Stok Fisik</p>
            <p className="text-2xl font-bold text-blue-600">{totalStok} Pcs</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Status Database</p>
            <p className="text-sm font-bold text-green-600">✅ Terhubung</p>
          </div>
        </div>

        {/* FORM INPUT */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            📦 Tambah Souvenir Baru
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" placeholder="Nama Souvenir" value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input 
              type="number" placeholder="Jumlah Stok" value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input 
              type="text" placeholder="URL Gambar (Opsional)" value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button 
              type="submit" disabled={submitting}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {submitting ? 'Menyimpan...' : '💾 Simpan'}
            </button>
          </form>
          {message.text && (
            <div className={`mt-3 p-2 rounded text-sm text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
        </div>

        {/* TABEL DATA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Daftar Souvenir Aktif</h3>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500 animate-pulse">Memuat data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="p-4">Nama Barang</th>
                    <th className="p-4">Stok</th>
                    <th className="p-4">Gambar</th>
                    <th className="p-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {souvenirs.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-800">{item.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          item.stock > 15 ? 'bg-green-100 text-green-700' : 
                          item.stock > 5 ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-500 truncate max-w-[150px]">
                        {item.image_url ? item.image_url : '-'}
                      </td>
                      <td className="p-4">
                        {/* Tombol Hapus */}
                        <button 
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-red-600 hover:text-red-800 text-sm font-semibold hover:underline"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {souvenirs.length === 0 && (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">Belum ada data.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;