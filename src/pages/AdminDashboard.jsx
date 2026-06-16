// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

// 🎨 PALET WARNA WEDDING PRESET
const WEDDING_COLORS = [
  { name: 'Rose Gold', value: '#e8b4b8' },
  { name: 'Sage Green', value: '#a3b18a' },
  { name: 'Navy Blue', value: '#344e41' },
  { name: 'Classic Gold', value: '#d4af37' },
  { name: 'Dusty Purple', value: '#9d8189' },
  { name: 'Soft Pink', value: '#ffb7b2' },
];

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [eventForm, setEventForm] = useState({ name: '', slug: '', date: '', theme_color: '#e8b4b8' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: false });
    setEvents(data || []);
    setLoading(false);
  };

  // Auto-generate slug
  const handleNameChange = (e) => {
    const name = e.target.value;
    setEventForm(prev => ({ ...prev, name }));
    if (!eventForm.slug) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setEventForm(prev => ({ ...prev, slug }));
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.name || !eventForm.slug) return;
    setSubmitting(true);

    const { error } = await supabase.from('events').insert([{
      name: eventForm.name,
      slug: eventForm.slug.toLowerCase(),
      date: eventForm.date || null,
      theme_color: eventForm.theme_color
    }]);

    if (error) {
      setMessage({ type: 'error', text: error.code === '23505' ? 'Slug sudah dipakai!' : error.message });
    } else {
      setMessage({ type: 'success', text: '✅ Event berhasil dibuat!' });
      setEventForm({ name: '', slug: '', date: '', theme_color: '#e8b4b8' });
      fetchEvents();
    }
    setSubmitting(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Hapus event ini permanen? Semua data terkait akan ikut terhapus.')) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) {
        alert('Gagal: ' + error.message);
      } else {
        fetchEvents();
      }
    }
  };

  // Cek apakah event sudah lewat tanggal
  const isEventPassed = (date) => date && new Date(date) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">️ Admin Dashboard</h1>
          <Link to="/" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm">← Ke Lapangan</Link>
        </div>

        {/* FORM BUAT EVENT */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="font-semibold text-gray-700 mb-4">✨ Buat Event Baru</h3>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nama Pasangan (Contoh: Tayo & Mimi)" value={eventForm.name} onChange={handleNameChange} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-500" required />
              <input type="text" placeholder="Slug URL (Contoh: tayo-mimi)" value={eventForm.slug} onChange={e => setEventForm({...eventForm, slug: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-500" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-pink-500" />
              
              {/* PRESET WARNA */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500 mr-2">Pilih Warna:</span>
                {WEDDING_COLORS.map((c) => (
                  <button 
                    key={c.value} 
                    type="button"
                    onClick={() => setEventForm({...eventForm, theme_color: c.value})}
                    className={`w-8 h-8 rounded-full border-2 transition hover:scale-110 ${eventForm.theme_color === c.value ? 'border-gray-800 scale-110 shadow-md' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
                              <div className="flex items-center gap-2 border-l pl-3 border-gray-300">
                <label className="text-xs text-gray-500">Manual:</label>
                <input 
                  type="color" 
                  value={eventForm.theme_color} 
                  onChange={e => setEventForm({...eventForm, theme_color: e.target.value})}
                  className="w-8 h-8 p-0 border-0 rounded cursor-pointer bg-transparent"
                  title="Pilih warna custom"
                />
              </div>
              </div>
            </div>

            <button type="submit" disabled={submitting} className={`w-full py-3 rounded-lg font-semibold text-white transition ${submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {submitting ? 'Menyimpan...' : '💾 Simpan Event'}
            </button>
            {message.text && <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
          </form>
        </div>

        {/* DAFTAR EVENT */}
        <h3 className="font-semibold text-gray-700 mb-4 text-xl">📅 Kelola Event Anda</h3>
        {loading ? (
          <p className="text-center text-gray-500">Memuat data...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(ev => {
  const passed = isEventPassed(ev.date);
  return (
    <div key={ev.id} className={`relative bg-white p-5 rounded-xl shadow-sm border transition ${passed ? 'border-gray-200 opacity-70' : 'border-gray-200 hover:border-blue-400'}`}>
      
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-1 rounded text-xs font-bold ${passed ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>
          {passed ? 'SELESAI' : 'AKTIF'}
        </span>
      </div>

      <h4 className="font-bold text-lg text-gray-800">{ev.name}</h4>
      <p className="text-xs text-gray-500 mb-4">🔗 /event/{ev.slug}</p>

      {/* FITUR BARU: Quick Edit Warna Tema */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-400">Tema:</span>
        <div className="flex gap-1">
          {WEDDING_COLORS.map((c) => (
            <button 
              key={c.value}
              onClick={async () => {
                // Update database
                await supabase.from('events').update({ theme_color: c.value }).eq('id', ev.id);
                // Update state lokal biar langsung berubah tanpa refresh
                setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, theme_color: c.value } : e));
              }}
              className={`w-5 h-5 rounded-full border transition hover:scale-125 ${ev.theme_color === c.value ? 'border-gray-800 scale-110 shadow-sm' : 'border-transparent'}`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
                            <input 
                    type="color" 
                    value={ev.theme_color} 
                    onChange={async (e) => {
                      const newColor = e.target.value;
                      await supabase.from('events').update({ theme_color: newColor }).eq('id', ev.id);
                      setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, theme_color: newColor } : e));
                    }}
                    className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
                    title="Pilih warna custom"
                  />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Link 
          to={`/admin/event/${ev.id}`} 
          className="flex-1 py-2 text-center bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
        >
          Kelola Souvenir
        </Link>
        <Link 
  to={`/admin/report/${ev.id}`}
  className="flex-1 py-2 text-center bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition"
>
  📊 Laporan
</Link>
        <button onClick={() => handleDeleteEvent(ev.id)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
          🗑️
        </button>
      </div>
    </div>
  );
})}
            {events.length === 0 && <p className="text-gray-400 col-span-3 text-center py-8">Belum ada event.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;