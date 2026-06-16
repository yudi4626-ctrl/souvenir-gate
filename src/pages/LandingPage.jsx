// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🎁</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 font-serif">
            SouvenirGate
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistem manajemen souvenir pernikahan modern dengan teknologi offline-first. 
            Tidak perlu khawatir sinyal, data tetap aman & tersinkron otomatis.
          </p>
          <Link 
            to="wa.me/6289607760163" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            🚀 Hubungi Admin 
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-serif">
            ✨ Fitur Unggulan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">📴</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Offline Mode</h3>
              <p className="text-gray-600">
                Tetap berfungsi tanpa internet. Data tersimpan otomatis di perangkat & sync saat online.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Multi-Event</h3>
              <p className="text-gray-600">
                Kelola banyak event pernikahan dalam satu dashboard. Setiap klien punya URL & data terpisah.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">QR Code Access</h3>
              <p className="text-gray-600">
                Tim lapangan cukup scan QR code untuk akses halaman counter. Tidak perlu ketik URL manual.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Custom Theme</h3>
              <p className="text-gray-600">
                Setiap event bisa punya tema warna sendiri. Pilih dari palet wedding yang elegan.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Real-time Sync</h3>
              <p className="text-gray-600">
                Stok souvenir update otomatis. Dashboard admin & counter lapangan selalu sinkron.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Data Aman</h3>
              <p className="text-gray-600">
                Database cloud dengan Row Level Security (RLS). Data klien terlindungi & privat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 font-serif">
            📋 Cara Kerja
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-gray-800">Buat Event</h3>
                <p className="text-gray-600">Admin membuat event baru, tentukan nama pasangan, tanggal, & tema warna</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-gray-800">Input Souvenir</h3>
                <p className="text-gray-600">Tambahkan daftar souvenir beserta stok untuk setiap event</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-gray-800">Bagikan QR Code</h3>
                <p className="text-gray-600">Tim lapangan scan QR code untuk akses halaman counter</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">4</div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-gray-800">Mulai Counter</h3>
                <p className="text-gray-600">Catat pembagian souvenir dengan mudah, data auto-sync ke cloud</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 font-serif">
            Siap Mempermudah Event Anda?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Bergabunglah dengan ratusan pasangan & wedding organizer yang telah menggunakan SouvenirGate
          </p>
          <Link 
            to="/" 
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Buat Event Pertama Anda →
          </Link>
        </div>
      </section>

      {/* Contact & Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">SouvenirGate</h3>
            <p className="text-sm">
              Solusi modern untuk manajemen souvenir pernikahan. Offline-first, multi-event, dan mudah digunakan.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 Email: hello@souvenirgate.com</li>
              <li>📱 WhatsApp: +62 812-3456-7890</li>
              <li>📍 Jakarta, Indonesia</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Ikuti Kami</h3>
            <div className="flex gap-4">
              <a href="#" className="text-2xl hover:text-white transition">📘</a>
              <a href="#" className="text-2xl hover:text-white transition">📸</a>
              <a href="#" className="text-2xl hover:text-white transition">🐦</a>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>© {new Date().getFullYear()} SouvenirGate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;