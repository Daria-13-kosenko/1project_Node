import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './db/index.js'
import authRouter from './routes/auth.js'
import postRouter from './routes/posts.js'

dotenv.config()
const app = express()

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3333
app.use(express.json())

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at ${HOST}:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start server', error)
  })

app.use('/auth', authRouter)
app.use('/posts', postRouter)
