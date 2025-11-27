import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { authenticate } from '../middleware/auth'

const router = Router()

// Public routes
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

// Protected routes (require authentication)
router.get('/me', authenticate, AuthController.getCurrentUser)
router.get('/profile', authenticate, AuthController.getProfile)
router.post('/profile', authenticate, AuthController.updateProfile)
router.put('/profile', authenticate, AuthController.updateProfile)

export default router