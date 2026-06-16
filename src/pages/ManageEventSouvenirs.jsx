// src/pages/ManageEventSouvenirs.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ManageEventSouvenirs = () => {
  const { eventId } = useParams();
  const [souvenirs, setSouvenirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [eventName, setEventName] = useState('');
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    stock: '', 
    imageFile: null, // File baru yang diupload
    existingImageUrl: '' // URL gambar yang sudah ada di database
  });

  useEffect(() => { 
    fetchSouvenirs(); 
    fetchEventName();
  }, []);
  
  const fetchEventName = async () => {
    const { data } = await supabase.from('events').select('name').eq('id', eventId).single();
    if (data) setEventName(data.name);
  };

  const fetchSouvenirs = async () => {
    setLoading(true);
    const { data } = await supabase.from('souvenirs').select('*').eq('event_id', eventId).order('created_at', { ascending: false });
    setSouvenirs(data || []);
    setLoading(false);
  };

  // ️ Fungsi Upload ke Supabase Storage
  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('souvenir-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage.from('souvenir-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // ️ Fungsi Hapus Gambar dari Storage
  const deleteImage = async (url) => {
    if (!url) return;
    // Ambil nama file dari URL (bagian paling belakang)
    const fileName = url.split('/').pop();
    await supabase.storage.from('souvenir-images').remove([fileName]);
  };

  // Handle Input File
  const handleFileChange = (e) => {
    setForm({ ...form, imageFile: e.target.files[0] });
  };

  // Handle Submit (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.stock) return;
    setUploading(true);

    try {
      let finalImageUrl = form.existingImageUrl;

      // Jika ada file baru yang diupload
      if (form.imageFile) {
        // Hapus gambar lama jika sedang mode edit
        if (editingId && form.existingImageUrl) {
          await deleteImage(form.existingImageUrl);
        }
        // Upload gambar baru
        finalImageUrl = await uploadImage(form.imageFile);
      }

      if (editingId) {
        // UPDATE
        await supabase.from('souvenirs').update({
          name: form.name,
          stock: parseInt(form.stock),
          image_url: finalImageUrl
        }).eq('id', editingId);
      } else {
        // INSERT
        await supabase.from('souvenirs').insert({
          event_id: eventId,
          name: form.name,
          stock: parseInt(form.stock),
          image_url: finalImageUrl || ''
        });
      }

      // Reset Form
      setForm({ name: '', stock: '', imageFile: null, existingImageUrl: '' });
      setEditingId(null);
      fetchSouvenirs();
    } catch (error) {
      alert('Gagal menyimpan: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle Klik Edit
  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      stock: item.stock.toString(),
      imageFile: null,
      existingImageUrl: item.image_url || ''
    });
    // Scroll ke atas agar form terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Klik Hapus
  const handleDelete = async (item) => {
    if (window.confirm(`Hapus "${item.name}"? Gambar juga akan dihapus dari storage.`)) {
      if (item.image_url) {
        await deleteImage(item.image_url);
      }
      await supabase.from('souvenirs').delete().eq('id', item.id);
      fetchSouvenirs();
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', stock: '', imageFile: null, existingImageUrl: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📦 Kelola Souvenir <span className="text-pink-600">{eventName}</span></h1>
          <Link to="/admin" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition text-sm">← Kembali ke Dashboard</Link>
        </div>

        {/* FORM INPUT / EDIT */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="font-semibold text-gray-700 mb-4 text-lg">
            {editingId ? '✏️ Edit Souvenir' : '➕ Tambah Souvenir Baru'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Nama Barang (Contoh: Mug Custom)" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <input 
                type="number" 
                placeholder="Stok Awal" 
                value={form.stock} 
                onChange={e => setForm({...form, stock: e.target.value})} 
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>

            {/* Upload Gambar */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition">
              {form.existingImageUrl && !form.imageFile && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Gambar saat ini:</p>
                  <img src={form.existingImageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg mx-auto border" />
                </div>
              )}
              
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {form.imageFile && <p className="text-xs text-green-600 mt-2">✅ File baru dipilih: {form.imageFile.name}</p>}
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={uploading} 
                className={`flex-1 py-3 rounded-lg font-bold text-white transition ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {uploading ? 'Menyimpan & Mengupload...' : (editingId ? '💾 Update Souvenir' : '💾 Simpan Souvenir')}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* DAFTAR SOUVENIR */}
        <h3 className="font-semibold text-gray-700 mb-4 text-xl">Daftar Souvenir ({souvenirs.length})</h3>
        
        {loading ? (
          <p className="text-center text-gray-500 py-8 animate-pulse">Memuat data...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {souvenirs.map(item => (
              <div key={item.id} className="p-4 border-b last:border-b-0 flex items-center gap-4 hover:bg-gray-50 transition">
                {/* Thumbnail */}
                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className={`text-sm font-medium ${item.stock === 0 ? 'text-red-500' : item.stock <= 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                    Stok: {item.stock} pcs
                  </p>
                </div>

                {/* Aksi */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item)} 
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
            {souvenirs.length === 0 && <p className="p-8 text-center text-gray-400">Belum ada souvenir untuk event ini.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEventSouvenirs;