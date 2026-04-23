import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function BalloonUpload({ onUploadComplete }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const onDrop = useCallback((accepted) => {
    const f = accepted[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('image', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (!res.ok) throw new Error('Upload failed')
      setPreview(null)
      setFile(null)
      onUploadComplete?.()
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {preview ? (
        <div className="flex items-center gap-2">
          <img src={preview} alt="preview" className="h-10 w-10 object-cover rounded" />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
          <button
            onClick={() => { setPreview(null); setFile(null) }}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg px-4 py-2 cursor-pointer text-sm transition-colors ${
            isDragActive
              ? 'border-indigo-400 bg-indigo-50 text-indigo-600'
              : 'border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? 'Drop it!' : '+ Add Balloon'}
        </div>
      )}
    </div>
  )
}
