import { useEffect, useRef, useState } from 'react'

const SHAPES = ['round', 'long', 'heart', 'star', 'other']
const SIZES = ['small', 'medium', 'large']

export default function BalloonDetail({ balloon, onClose, onSave }) {
  const [form, setForm] = useState({
    tags: (balloon.tags || []).join(', '),
    color: balloon.color || '',
    size: balloon.size || 'medium',
    shape: balloon.shape || 'round',
    event_name: balloon.event_name || '',
    event_location: balloon.event_location || '',
    event_date: balloon.event_date || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }
      const res = await fetch(`/api/balloons/${balloon.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      const updated = await res.json()
      onSave(updated)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="grid sm:grid-cols-2 gap-0">
          <div className="bg-gray-100 rounded-tl-2xl rounded-bl-2xl overflow-hidden">
            <img
              src={balloon.image_url}
              alt="balloon"
              className="w-full h-full object-contain max-h-96 sm:max-h-full"
            />
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Edit Balloon</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>

            <Field label="Tags (comma-separated)">
              <input
                className={inputCls}
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="red, latex, celebration"
              />
            </Field>

            <Field label="Color">
              <input
                className={inputCls}
                value={form.color}
                onChange={(e) => set('color', e.target.value)}
                placeholder="red"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Shape">
                <select className={inputCls} value={form.shape} onChange={(e) => set('shape', e.target.value)}>
                  {SHAPES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Size">
                <select className={inputCls} value={form.size} onChange={(e) => set('size', e.target.value)}>
                  {SIZES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Event Name">
              <input className={inputCls} value={form.event_name} onChange={(e) => set('event_name', e.target.value)} placeholder="Birthday party" />
            </Field>

            <Field label="Event Location">
              <input className={inputCls} value={form.event_location} onChange={(e) => set('event_location', e.target.value)} placeholder="New York, NY" />
            </Field>

            <Field label="Event Date">
              <input type="date" className={inputCls} value={form.event_date} onChange={(e) => set('event_date', e.target.value)} />
            </Field>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400'

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
