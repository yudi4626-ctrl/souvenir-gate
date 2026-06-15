// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { useState, useEffect } from 'react'
import AdminDashboard from './pages/AdminDashboard'

import SouvenirGrid from './components/SouvenirGrid'
// import AdminDashboard from './pages/AdminDashboard' // Nanti kita aktifkan

function App() {
  // Status Koneksi (tetap kita pertahankan di sini)
  const [connStatus, setConnStatus] = useState('Mengecek...')

  useEffect(() => {
    const check = async () => {
      const { error } = await supabase.from('events').select('id').limit(1)
      setConnStatus(error ? '🔴 Koneksi Error' : '🟢 Terhubung ke Supabase')
    }
    check()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bar Status Global */}
      <div className="bg-green-100 text-green-700 text-center py-1 text-xs font-medium">
        {connStatus}
      </div>

      {/* Routing: Tentukan halaman berdasarkan URL */}
      <Routes>
        {/* Halaman Utama: Lapangan (Counter) */}
        <Route path="/" element={<SouvenirGrid />} />
        
        {/* Halaman Admin: Nanti kita buat */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  )
}

export default App