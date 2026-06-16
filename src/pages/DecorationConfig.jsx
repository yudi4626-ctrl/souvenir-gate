// src/pages/DecorationConfig.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const DecorationConfig = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // State Konfigurasi Baru (Anchor System)
  const [config, setConfig] = useState({
    anchor: 'top-left', // Posisi pojok
    offset: 5,          // Jarak dari tepi (%)
    rotation: 0,        // Rotasi
    scale: 100,         // Ukuran
    opacity: 80         // Transparansi
  });
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      const { data } = await supabase.from('events').select('*').eq('id', eventId).single();
      if (data) {
        setEvent(data);
        if (data.decoration_config) {
          setConfig(prev => ({ ...prev, ...data.decoration_config }));
          setPreviewUrl(data.decoration_config.url || null);
        }
      }
    };
    loadEvent();
  }, [eventId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    const finalConfig = { ...config, url: previewUrl || '' };
    const { error } = await supabase.from('events').update({ decoration_config: finalConfig }).eq('id', eventId);
    
    if (error) setMessage('❌ Gagal menyimpan!');
    else setMessage('✅ Dekorasi berhasil disimpan!');
    
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const updateConfig = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));

  // Helper untuk menghitung posisi CSS berdasarkan Anchor
  const getPositionStyle = (anchor, offset) => {
    const styles = {};
    const off = `${offset}%`;
    if (anchor === 'top-left') { styles.top = off; styles.left = off; }
    else if (anchor === 'top-center') { styles.top = off; styles.left = '50%'; styles.transform = 'translateX(-50%)'; }
    else if (anchor === 'top-right') { styles.top = off; styles.right = off; }
    else if (anchor === 'bottom-left') { styles.bottom = off; styles.left = off; }
    else if (anchor === 'bottom-center') { styles.bottom = off; styles.left = '50%'; styles.transform = 'translateX(-50%)'; }
    else if (anchor === 'bottom-right') { styles.bottom = off; styles.right = off; }
    return styles;
  };

  if (!event) return <div className="p-10 text-center animate-pulse">Memuat data event...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">🎨 Dekorasi: {event.name}</h1>
          <Link to="/admin" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">← Kembali</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* PANEL KONTROL */}
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-6 h-fit">
            <div>
              <h3 className="font-bold text-lg border-b pb-2 mb-4">1. Upload Gambar</h3>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            
            <div>
              <h3 className="font-bold text-lg border-b pb-2 mb-4">2. Pilih Posisi (Pojok)</h3>
              <div className="grid grid-cols-3 gap-2">
                {['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                  <button 
                    key={pos}
                    onClick={() => updateConfig('anchor', pos)}
                    className={`py-3 rounded-lg text-sm font-medium border-2 transition ${config.anchor === pos ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {pos.replace('-', ' ').replace('top', 'Atas').replace('bottom', 'Bawah').replace('left', 'Kiri').replace('right', 'Kanan').replace('center', 'Tengah')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">3. Atur Detail</h3>
              
              <div>
                <label className="flex justify-between text-sm font-medium mb-1"><span>↔️ Jarak dari Tepi (Offset)</span><span>{config.offset}%</span></label>
                <input type="range" min="0" max="30" value={config.offset} onChange={e => updateConfig('offset', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium mb-1"><span>🔄 Rotasi</span><span>{config.rotation}°</span></label>
                <input type="range" min="0" max="360" value={config.rotation} onChange={e => updateConfig('rotation', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium mb-1"><span>🔍 Ukuran</span><span>{config.scale}%</span></label>
                <input type="range" min="20" max="200" value={config.scale} onChange={e => updateConfig('scale', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium mb-1"><span>️ Opacity</span><span>{config.opacity}%</span></label>
                <input type="range" min="0" max="100" value={config.opacity} onChange={e => updateConfig('opacity', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition mt-4">
              {saving ? 'Menyimpan...' : '💾 Simpan Dekorasi'}
            </button>
            {message && <p className={`text-center text-sm font-medium ${message.includes('Gagal') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
          </div>

          {/* AREA PREVIEW */}
          <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-4 relative overflow-hidden flex flex-col items-center justify-center h-[600px]">
            <h3 className="absolute top-4 left-4 text-xs font-bold text-gray-400 uppercase bg-white px-2 py-1 rounded z-20">Live Preview</h3>
            
            <div className="w-full h-full bg-white shadow-sm relative overflow-hidden rounded-lg">
              <div className="h-24 bg-white/80 border-b flex items-center justify-center">
                <span className="font-serif text-xl text-gray-400">{event.name}</span>
              </div>

              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Decoration"
                  style={{
                    position: 'absolute',
                    ...getPositionStyle(config.anchor, config.offset),
                    transform: `${getPositionStyle(config.anchor, config.offset).transform || ''} rotate(${config.rotation}deg) scale(${config.scale / 100})`,
                    opacity: config.opacity / 100,
                    maxWidth: '40%', 
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <p>Upload gambar untuk melihat preview</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DecorationConfig;