import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import express from 'express'
import { getDb } from '../db/index.js'

const router = express.Router()

dotenv.config()

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required!',
      })
    }

    const db = getDb()
    const usersCollection = db.collection('users')

    const existingUser = await usersCollection.findOne({ username })

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exist',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      username,
      password: hashedPassword,
      createdAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser)
    res.status(201).json({
      message: 'User registred successfully',
      userId: result.inserId,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      })
    }

    const db = getDb()
    const usersCollection = db.collection('users')

    const user = await usersCollection.findOne({ username })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: 'Invalid password',
      })
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
    )
    res.json({
      message: 'Login successfully',
      token,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
})

export default router
