export default function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by tag, color, shape, event name…"
        className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {/* TODO: pgvector semantic search */}
    </div>
  )
}
