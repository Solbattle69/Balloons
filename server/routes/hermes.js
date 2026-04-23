const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { tagBalloon } = require('../lib/tagBalloon')

router.post('/', async (req, res) => {
  const secret = req.headers['x-hermes-secret']
  if (!secret || secret !== process.env.HERMES_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { event, image_url, balloon_id } = req.body
  if (event !== 'new_upload' || !image_url || !balloon_id) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const tagging = await tagBalloon(image_url)

  const { error } = await supabase
    .from('balloons')
    .update({
      tags: tagging.tags,
      color: tagging.color,
      size: tagging.size,
      shape: tagging.shape,
    })
    .eq('id', balloon_id)

  if (error) {
    console.error('Supabase update error:', error)
    return res.status(500).json({ error: 'Database update failed' })
  }

  res.json({ success: true, tags: tagging.tags })
})

module.exports = router
