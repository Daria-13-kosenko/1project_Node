import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return req.status(401).json({
        message: 'No token provided',
      })
    }

    const token = authHeader.split('')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Invalid token format',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized',
    })
  }
}
