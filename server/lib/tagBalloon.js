const axios = require('axios')

const SYSTEM_PROMPT = `You are a balloon expert. Analyze this image and return JSON only:
{ "tags": string[], "color": string, "size": "small"|"medium"|"large", "shape": "round"|"long"|"heart"|"star"|"other", "confidence": number }`

async function tagBalloon(imageUrl) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: SYSTEM_PROMPT },
              { type: 'image_url', image_url: { url: imageUrl, detail: 'auto' } },
            ],
          },
        ],
        max_tokens: 300,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const raw = response.data.choices[0].message.content
    const parsed = JSON.parse(raw)

    return {
      tags: Array.isArray(parsed.tags) ? parsed.tags : ['untagged'],
      color: parsed.color || 'unknown',
      size: ['small', 'medium', 'large'].includes(parsed.size) ? parsed.size : 'medium',
      shape: ['round', 'long', 'heart', 'star', 'other'].includes(parsed.shape)
        ? parsed.shape
        : 'other',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
    }
  } catch (err) {
    console.error('tagBalloon error:', err?.response?.data || err.message)
    return { tags: ['untagged'], color: 'unknown', size: 'medium', shape: 'other', confidence: 0 }
  }
}

module.exports = { tagBalloon }
