require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')

const uploadRouter = require('./routes/upload')
const balloonsRouter = require('./routes/balloons')
const hermesRouter = require('./routes/hermes')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/upload', uploadRouter)
app.use('/api/balloons', balloonsRouter)
app.use('/api/webhook/hermes', hermesRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
