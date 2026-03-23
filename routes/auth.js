import { Router } from 'express'

const router = Router()

router.post('/register', (req, res) => {
  res.send('User registred')
})

router.post('/login', (req, res) => {
  res.send('User logged in!')
})

export default router
