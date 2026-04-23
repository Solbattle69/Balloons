import { useState } from 'react'
import BalloonUpload from './components/BalloonUpload'
import BalloonGrid from './components/BalloonGrid'
import SearchBar from './components/SearchBar'
import './index.css'

export default function App() {
  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  function handleUploadComplete() {
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">🎈 Balloon Library</h1>
        <BalloonUpload onUploadComplete={handleUploadComplete} />
      </header>

      <main className="px-6 py-6 max-w-7xl mx-auto">
        <SearchBar value={search} onChange={setSearch} />
        <BalloonGrid search={search} refreshKey={refreshKey} />
      </main>
    </div>
  )
}
