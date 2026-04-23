const express = require('express')
const router = express.Router()
const multer = require('multer')
const axios = require('axios')
const FormData = require('form-data')
const supabase = require('../lib/supabase')

// DECISION: Store uploads in memory (no disk writes) — files are processed and
// forwarded to Remove.bg then Supabase Storage immediately.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } })

async function removeBackground(buffer, filename) {
  const form = new FormData()
  form.append('image_file', buffer, { filename, contentType: 'image/png' })
  form.append('size', 'auto')

  const response = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
    headers: {
      ...form.getHeaders(),
      'X-Api-Key': process.env.REMOVEBG_API_KEY,
    },
    responseType: 'arraybuffer',
  })

  return Buffer.from(response.data)
}

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' })
  }

  try {
    let imageBuffer = req.file.buffer
    const originalName = req.file.originalname

    // Strip background if API key is configured
    if (process.env.REMOVEBG_API_KEY) {
      try {
        imageBuffer = await removeBackground(imageBuffer, originalName)
      } catch (bgErr) {
        console.error('Remove.bg failed, using original:', bgErr?.response?.status || bgErr.message)
      }
    }

    const fileName = `${Date.now()}-${originalName.replace(/\s+/g, '_')}`
    const storagePath = `balloons/${fileName}`

    const { error: storageError } = await supabase.storage
      .from('balloon-images')
      .upload(storagePath, imageBuffer, { contentType: 'image/png', upsert: false })

    if (storageError) throw storageError

    const { data: publicUrlData } = supabase.storage
      .from('balloon-images')
      .getPublicUrl(storagePath)

    const imageUrl = publicUrlData.publicUrl

    const { data: balloon, error: dbError } = await supabase
      .from('balloons')
      .insert({ image_url: imageUrl, tags: [], color: null, shape: null, size: null })
      .select('id')
      .single()

    if (dbError) throw dbError

    // Notify Hermes to trigger tagging
    if (process.env.HERMES_WEBHOOK_URL) {
      axios
        .post(
          process.env.HERMES_WEBHOOK_URL,
          { event: 'new_upload', image_url: imageUrl, balloon_id: balloon.id },
          { headers: { 'X-Hermes-Secret': process.env.HERMES_WEBHOOK_SECRET } }
        )
        .catch((e) => console.error('Hermes notify failed:', e.message))
    }

    res.json({ id: balloon.id, image_url: imageUrl })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Upload failed' })
  }
})

module.exports = router
