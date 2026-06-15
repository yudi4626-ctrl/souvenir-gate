// src/components/QuantityModal.jsx
import { useState, useEffect } from 'react';

const QuantityModal = ({ isOpen, onClose, onConfirm, souvenirName, maxStock }) => {
  useEffect(() => {
    if (isOpen) setQty(1);
  },[isOpen]);
    const [qty, setQty] = useState(1);

  // Batasi pilihan maksimal 5 atau sesuai sisa stok (mana yang lebih kecil)
  const limit = Math.min(5, maxStock);
  const options = Array.from({ length: limit }, (_, i) => i + 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">{souvenirName}</h3>
        <p className="text-gray-500 text-center mb-6 text-sm">Mau ambil berapa pcs?</p>
        
        {/* Pilihan Jumlah */}
        <div className="flex justify-center gap-3 mb-8">
          {options.map((num) => (
            <button
              key={num}
              onClick={() => setQty(num)}
              className={`w-14 h-14 rounded-xl text-lg font-bold transition-all duration-200 ${
                qty === num
                  ? 'bg-pink-500 text-white scale-110 shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(qty)}
            className="flex-1 py-3 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition shadow-md"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;