const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const app = express()
app.use(cors())
app.use(express.json())

// Debug: log if token is loaded
if (!process.env.FACEBOOK_ACCESS_TOKEN) {
  console.warn('⚠️  FACEBOOK_ACCESS_TOKEN not found in .env.local')
} else {
  console.log('✓ FACEBOOK_ACCESS_TOKEN loaded')
}

function detectPlatform(url) {
  if (!url || typeof url !== 'string') return null
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('facebook.com')) return 'facebook'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'x'
  return null
}

app.post('/fetch-post', async (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ success: false, error: 'Missing url' })
  const platform = detectPlatform(url)
  if (!platform) return res.status(400).json({ success: false, error: 'Unsupported platform' })

  try {
    let oembedUrl = ''
    if (platform === 'instagram') {
      const token = process.env.FACEBOOK_ACCESS_TOKEN
      if (!token) throw new Error('FACEBOOK_ACCESS_TOKEN not set')
      oembedUrl = `https://graph.facebook.com/v22.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${token}`
    } else if (platform === 'facebook') {
      const token = process.env.FACEBOOK_ACCESS_TOKEN
      if (!token) throw new Error('FACEBOOK_ACCESS_TOKEN not set')
      oembedUrl = `https://graph.facebook.com/v22.0/oembed_post?url=${encodeURIComponent(url)}&access_token=${token}`
    } else if (platform === 'x') {
      oembedUrl = `https://publish.x.com/oembed?url=${encodeURIComponent(url)}`
    }

    console.log(`📤 Fetching ${platform} from:`, oembedUrl.replace(/access_token=[^&]*/, 'access_token=***'))
    const response = await axios.get(oembedUrl, { timeout: 10000 })
    const data = response.data || {}
    const html = data.html || ''
    const $ = cheerio.load(html)
    const text = $.root().text().trim()
    
    // Extract image and metadata based on platform
    let mediaUrl = ''
    let profilePic = ''
    
    if (platform === 'x') {
      // For Twitter/X, try to extract image URLs from various sources
      mediaUrl = data.thumbnail_url || ''
      // X oEmbed may include author profile image in thumbnail_url
      profilePic = data.thumbnail_url || ''
    } else {
      // For Instagram/Facebook, parse HTML for images
      const firstImg = $('img').first().attr('src') || ''
      mediaUrl = firstImg || data.thumbnail_url || ''
      profilePic = data.thumbnail_url || firstImg || ''
    }
    
    const author_name = data.author_name || ''
    const author_url = data.author_url || ''
    const username = author_url ? `@${author_url.split('/').filter(Boolean).pop()}` : (author_name ? `@${author_name.replace(/\s+/g,'').toLowerCase()}` : '')

    const mapped = {
      network: platform === 'x' ? 'x' : platform === 'instagram' ? 'instagram' : 'facebook',
      displayName: author_name || 'Usuario',
      username: username || '@usuario',
      profilePic: profilePic,
      text: text || '',
      mediaUrl: mediaUrl,
      likes: '',
      comments: '',
      retweets: '',
      date: data.provider_name || '',
      isVideo: $('video').length > 0,
      isVerified: false,
    }
    
    console.log(`✓ Extracted data from ${platform} post:`, { author: author_name, text_length: text.length })

    return res.json({ success: true, data: mapped })
  } catch (err) {
    // Enhanced error logging for debugging
    let errorMsg = 'Error fetching post'
    
    if (err.response) {
      // Response from oEmbed API with error status
      console.error(`❌ oEmbed API error (${err.response.status}):`, {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
        url: url,
        platform: platform,
      })
      errorMsg = `oEmbed error: ${err.response.status} - ${err.response.data?.error_description || err.response.data?.error || err.response.statusText}`
    } else if (err.request) {
      // Request made but no response
      console.error('❌ No response from oEmbed API:', err.message, { url, platform })
      errorMsg = `No response from oEmbed: ${err.message}`
    } else {
      // Other errors
      console.error('❌ Fetch error:', err.message, { url, platform })
      errorMsg = err.message
    }
    
    return res.status(500).json({ success: false, error: errorMsg })
  }
})

const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
  console.log(`Proxy server listening on ${PORT}`)
})
