import { Request, Response, NextFunction } from 'express'
import { AuthUtils } from '../utils/auth'
import { ObjectId } from 'mongodb'

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
      }
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      })
      return
    }

    const token = authHeader.split(' ')[1]
    const decoded = AuthUtils.verifyToken(token)

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      })
      return
    }

    // Validate ObjectId
    if (!ObjectId.isValid(decoded.userId)) {
      res.status(401).json({
        success: false,
        message: 'Invalid user ID'
      })
      return
    }

    req.user = decoded
    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}