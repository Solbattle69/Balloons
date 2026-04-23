import { useEffect, useState } from 'react'
import BalloonCard from './BalloonCard'
import BalloonDetail from './BalloonDetail'

function matchesSearch(balloon, search) {
  if (!search) return true
  const q = search.toLowerCase()
  return (
    (balloon.tags || []).some((t) => t.toLowerCase().includes(q)) ||
    (balloon.color || '').toLowerCase().includes(q) ||
    (balloon.shape || '').toLowerCase().includes(q) ||
    (balloon.event_name || '').toLowerCase().includes(q)
  )
}

export default function BalloonGrid({ search, refreshKey }) {
  const [balloons, setBalloons] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/balloons')
      .then((r) => r.json())
      .then((data) => setBalloons(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [refreshKey])

  function handleSave(updated) {
    setBalloons((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
    setSelected(updated)
  }

  const filtered = balloons.filter((b) => matchesSearch(b, search))

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <p className="text-center text-gray-400 py-20">
        {search ? 'No balloons match your search.' : 'No balloons yet. Upload one!'}
      </p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((balloon) => (
          <BalloonCard key={balloon.id} balloon={balloon} onClick={setSelected} />
        ))}
      </div>

      {selected && (
        <BalloonDetail
          balloon={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
        />
      )}
    </>
  )
}
