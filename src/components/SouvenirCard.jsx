// src/components/SouvenirCard.jsx
const SouvenirCard = ({ name, imageUrl, stock, onClick }) => {
    const isOutOfStock = stock === 0; // <-- Tambah 'onClick' di sini
    return (
      // Tambah 'cursor-pointer active:scale-95' agar terasa seperti tombol
      <div 
        onClick={onClick} 
        className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center p-4 transition-transform hover:scale-[1.02] cursor-pointer active:scale-95 select-none"
      >
        <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
  {imageUrl ? (
    <img 
      src={imageUrl} 
      alt={name} 
      className="w-full h-full object-cover" 
    />
  ) : (
    <span className="text-gray-400 text-sm">📷 Foto</span>
  )}
</div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">{name}</h3>
        
        <div className={`text-sm font-medium px-3 py-1 rounded-full ${
          stock > 15 ? 'bg-green-100 text-green-700' : 
          stock > 5 ? 'bg-yellow-100 text-yellow-700' : 
          'bg-red-100 text-red-700'
        }`}>
          Sisa: {stock} pcs
        </div>
      </div>
    );
  };
  
  export default SouvenirCard;