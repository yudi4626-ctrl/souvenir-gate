// src/components/SouvenirGrid.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import SouvenirCard from './SouvenirCard';
import QuantityModal from './QuantityModal';
import { saveCache, loadCache, addPending, removeLastPending } from '../utils/localStore';
import { syncToSupabase } from '../utils/sync';

const SouvenirGrid = ({ eventId: propEventId, themeColor }) => {
  const [souvenirs, setSouvenirs] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle');

  // 1. Fungsi Helper: Fetch Souvenir Spesifik
  const fetchSouvenirs = async (id) => {
    try {
      const { data, error } = await supabase
        .from('souvenirs')
        .select('*')
        .eq('event_id', id);
      
      if (error) throw error;
      setSouvenirs(data || []);
    } catch (err) {
      console.error("Gagal fetch souvenirs:", err);
    }
  };

  // 2. Fungsi Helper: Fetch dari Database (Mode Default)
  const fetchFromDatabase = async () => {
    try {
      setLoading(true);
      const { data: event } = await supabase
        .from('events')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (event) {
        setEventId(event.id);
        await fetchSouvenirs(event.id);
        saveCache({ eventId: event.id, souvenirs: data }); // Simpan ke cache
      }
    } catch (err) {
      console.error("Gagal fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Strategi Load Awal (Online vs Offline)
  useEffect(() => {
    const init = async () => {
      // MODE EVENT KHUSUS: Langsung pakai ID yang dikasih dari props
      if (propEventId) {
        setEventId(propEventId);
        await fetchSouvenirs(propEventId);
        setLoading(false);
        return;
      }

      // MODE DEFAULT (/): Ambil event terbaru
      if (navigator.onLine) {
        await fetchFromDatabase();
      } else {
        // MODE OFFLINE: Load dari cache
        const cached = loadCache();
        if (cached) {
          setEventId(cached.eventId);
          setSouvenirs(cached.souvenirs);
        }
        setLoading(false);
        setIsOnline(false);
      }
    };
    init();
  }, []);

  // 4. Pantau Perubahan Jaringan
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      if (eventId) await runSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('idle');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [eventId]);

  // 5. Fungsi Kirim Data Pending ke Supabase
  const runSync = async () => {
    if (!eventId) return;
    setSyncStatus('syncing');
    const result = await syncToSupabase(eventId);
    setSyncStatus(result.success ? 'success' : 'error');
    setTimeout(() => setSyncStatus('idle'), 2000);
  };

  // 6. Handler Klik Kartu
const handleCardClick = (item) => {
  // Cegah jika stok 0 atau negatif
  if (!item.stock || item.stock <= 0) return;
  setSelectedItem(item);
  setModalOpen(true);
};

  // 7. Handler Konfirmasi (Kurangi Stok)
  const handleConfirm = (qty) => {
  // Validasi ulang: pastikan stok cukup
  const currentItem = souvenirs.find(s => s.id === selectedItem.id);
  if (!currentItem || currentItem.stock < qty) {
    alert('Stok tidak mencukupi!');
    setModalOpen(false);
    return;
  }

  setSouvenirs(prev => {
    const updated = prev.map(s => 
      s.id === selectedItem.id ? { ...s, stock: s.stock - qty } : s
    );
    saveCache({ eventId, souvenirs: updated }); // 💾 Simpan ke cache HP
    return updated;
  });

  addPending({
    souvenirId: selectedItem.id,
    qty,
    name: selectedItem.name,
    timestamp: Date.now()
  });

  setLastTransaction({ itemId: selectedItem.id, qty, name: selectedItem.name });
  setModalOpen(false);

  if (navigator.onLine && eventId) runSync();
};

  // 8. Handler Undo
  const handleUndo = () => {
    if (!lastTransaction) return;
    setSouvenirs(prev => {
      const reverted = prev.map(s => s.id === lastTransaction.itemId ? { ...s, stock: s.stock + lastTransaction.qty } : s);
      saveCache({ eventId, souvenirs: reverted });
      return reverted;
    });
    removeLastPending();
    setLastTransaction(null);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto relative min-h-screen bg-gray-50">
      {/* Ganti bagian bg-blue-500, bg-green-500, dll dengan dynamic style */}
<div className={`fixed top-0 left-0 right-0 py-2 text-center text-sm font-medium z-50 transition-colors shadow-sm ${
  !isOnline ? 'bg-orange-500 text-white' :
  syncStatus === 'syncing' ? 'text-white' :
  syncStatus === 'success' ? 'text-white' :
  syncStatus === 'error' ? 'bg-red-500 text-white' :
  'bg-white/80 backdrop-blur-sm text-gray-600 border-b'
}`}
style={{
  backgroundColor: syncStatus === 'syncing' ? themeColor : 
                  syncStatus === 'success' ? themeColor : 
                  !isOnline ? undefined : undefined
}}>
        {!isOnline ? '📴 Mode Offline - Data aman di perangkat' :
         syncStatus === 'syncing' ? ' Menyelaraskan data...' :
         syncStatus === 'success' ? '✅ Data tersinkron ke Cloud!' :
         syncStatus === 'error' ? '❌ Gagal sync, data tetap aman lokal' :
         '🟢 Online & Tersinkron'}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center mt-8">
        Pilih Souvenir Favoritmu
      </h2>

      {loading ? (
        <div className="text-center py-10 text-gray-500 animate-pulse">Memuat data...</div>
      ) : souvenirs.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Tidak ada data. Hubungi admin untuk setup event.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20">
          {souvenirs.map((item) => (
            <SouvenirCard
              key={item.id}
              name={item.name}
              imageUrl={item.image_url}
              stock={item.stock}
              onClick={() => handleCardClick(item)}
            />
          ))}
        </div>
      )}

      {lastTransaction && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md z-40">
          <button onClick={handleUndo} className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition">
            ↩️ Undo: {lastTransaction.name} (+{lastTransaction.qty})
          </button>
        </div>
      )}

      <QuantityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        souvenirName={selectedItem?.name}
        maxStock={selectedItem?.stock || 0}
      />
    </div>
  );
};

export default SouvenirGrid;