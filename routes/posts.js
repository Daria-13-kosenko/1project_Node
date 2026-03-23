import express from 'express'
import { getDB } from '../db/index.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const db = getDB()
    const postsCollection = db.collection('posts')

    const posts = await postsCollection.find().toArray()
    res.json(posts)
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
})
