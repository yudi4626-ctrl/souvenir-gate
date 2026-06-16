// src/components/SouvenirCard.jsx
const SouvenirCard = ({ name, imageUrl, stock, onClick }) => {
  const isOutOfStock = !stock || stock <= 0;
  
  return (
    <div 
      onClick={!isOutOfStock ? onClick : undefined}
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 active:scale-95 ${
        isOutOfStock 
          ? 'opacity-60 cursor-not-allowed grayscale' 
          : 'cursor-pointer hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">📷 Foto</span>
        )}
      </div>
      
      <div className="p-4 text-center">
        <h3 className="font-semibold text-gray-800 mb-2">{name}</h3>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
          isOutOfStock 
            ? 'bg-red-100 text-red-700' 
            : stock <= 5 
              ? 'bg-yellow-100 text-yellow-700' 
              : 'bg-green-100 text-green-700'
        }`}>
          {isOutOfStock ? 'Habis' : `Sisa: ${stock} pcs`}
        </span>
      </div>
    </div>
  );
};

export default SouvenirCard;