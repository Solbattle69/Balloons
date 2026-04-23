const SHAPE_COLORS = {
  round: 'bg-blue-100 text-blue-700',
  long: 'bg-green-100 text-green-700',
  heart: 'bg-pink-100 text-pink-700',
  star: 'bg-yellow-100 text-yellow-700',
  other: 'bg-gray-100 text-gray-600',
}

export default function BalloonCard({ balloon, onClick }) {
  const isUntagged = !balloon.tags || balloon.tags.length === 0 || balloon.tags[0] === 'untagged'

  return (
    <button
      onClick={() => onClick(balloon)}
      className={`group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left w-full ${
        isUntagged ? 'ring-2 ring-amber-400 animate-pulse' : ''
      }`}
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={balloon.image_url}
          alt={balloon.tags?.join(', ') || 'balloon'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>

      <div className="p-3 space-y-2">
        {balloon.color && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className="inline-block w-3 h-3 rounded-full border border-gray-200"
              style={{ backgroundColor: balloon.color }}
            />
            {balloon.color}
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {balloon.shape && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SHAPE_COLORS[balloon.shape] || SHAPE_COLORS.other}`}>
              {balloon.shape}
            </span>
          )}
          {(balloon.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {isUntagged && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              untagged
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
