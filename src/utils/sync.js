// src/utils/sync.js
import { supabase } from '../supabaseClient';
import { getPending, clearPending } from './localStore';

export const syncToSupabase = async (eventId) => {
  const pending = getPending();
  if (pending.length === 0) return { success: true, count: 0 };

  const payload = pending.map(tx => ({
    event_id: eventId,
    souvenir_id: tx.souvenirId,
    quantity: tx.qty,
    distributed_at: new Date(tx.timestamp).toISOString()
  }));

  try {
    const { error } = await supabase.from('distributions').insert(payload);
    if (error) throw error;
    
    clearPending();
    return { success: true, count: payload.length };
  } catch (err) {
    console.error("Sync gagal:", err);
    return { success: false, error: err.message };
  }
};