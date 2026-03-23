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

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({
        message: 'Title and content are required',
      })
    }

    const db = getDB()
    const postsCollection = db.collection('posts')

    const newPost = {
      title,
      content,
      author: req.user.username,
      userId: req.user.userId,
      createdAt: new Date(),
    }

    const result = await postsCollection.insertOne(newPost)

    res.status(201).json({
      message: 'Post created successfully',
      postId: result.insertedId,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
})

export default router
