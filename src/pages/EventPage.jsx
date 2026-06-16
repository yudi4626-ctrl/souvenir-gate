// src/pages/EventPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SouvenirGrid from '../components/SouvenirGrid';

const EventPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) setEvent(data);
      setLoading(false);
    };
    getEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#faf9f7]">
        <div className="text-4xl animate-bounce mb-4">🌸</div>
        <p className="text-gray-500 font-serif">Memuat halaman...</p>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-6 bg-[#faf9f7]">
        <h2 className="text-3xl font-serif text-gray-700">Event tidak ditemukan</h2>
        <Link to="/" className="px-6 py-3 bg-[#c99a7a] text-white rounded-xl font-serif hover:bg-[#b08565] transition">Kembali ke Beranda</Link>
      </div>
    );
  }

  const themeColor = event.theme_color || '#c99a7a';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-[#faf9f7] to-white">
      {/* Header Sticky - Tipis & Clean */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b" style={{ borderColor: `${themeColor}20` }}>
        <div className="max-w-3xl mx-auto px-4 py-4 text-center">
          
          {/* Emoji Dekorasi */}
          <div className="text-2xl mb-1 opacity-60" style={{ color: themeColor }}>
            ✦ ❀ 
          </div>

          {/* Nama Pasangan */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-wide mb-1" 
    style={{ fontFamily: "'Great Vibes', cursive", color: themeColor }}>
  {event.name}
</h1>
          
          {/* Divider Emoji */}
          <div className="flex items-center justify-center gap-2 my-2 opacity-60" style={{ color: themeColor }}>
            <div className="h-px w-12 bg-current"></div>
            <span className="text-sm">💍</span>
            <div className="h-px w-12 bg-current"></div>
          </div>

          {/* Tanggal */}
          {event.date && (
            <p className="text-xs text-gray-600 font-serif italic">
              {new Date(event.date).toLocaleDateString('id-ID', { 
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 pb-8 pt-6">
        <SouvenirGrid eventId={event.id} themeColor={themeColor} />
      </main>

      {/* Footer Minimalis */}
      <footer className="text-center py-4 text-gray-400 text-xs font-serif">
        <p>SouvenirGate © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default EventPage;