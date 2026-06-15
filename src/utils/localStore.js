// src/utils/localStore.js
const DATA_KEY = 'souvenirgate_cache';
const PENDING_KEY = 'souvenirgate_pending';

// Simpan seluruh data souvenir ke memori HP
export const saveCache = (data) => {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
};

// Baca data dari memori HP
export const loadCache = () => {
  try {
    return JSON.parse(localStorage.getItem(DATA_KEY)) || null;
  } catch {
    return null;
  }
};

// Simpan transaksi yang belum terkirim
export const addPending = (tx) => {
  const list = getPending();
  list.push({ ...tx, id: Date.now(), synced: false });
  localStorage.setItem(PENDING_KEY, JSON.stringify(list));
};

// Ambil daftar transaksi pending
export const getPending = () => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY)) || [];
  } catch {
    return [];
  }
};

// Hapus semua pending (setelah sukses sync)
export const clearPending = () => {
  localStorage.removeItem(PENDING_KEY);
};

// Hapus transaksi terakhir (untuk fitur Undo)
export const removeLastPending = () => {
  const list = getPending();
  if (list.length > 0) {
    list.pop();
    localStorage.setItem(PENDING_KEY, JSON.stringify(list));
  }
};