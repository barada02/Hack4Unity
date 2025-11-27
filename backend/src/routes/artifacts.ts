import { Router } from 'express'
import { ArtifactController } from '../controllers/artifactController'
import { authenticate } from '../middleware/auth'

const router = Router()

// Public routes (no authentication required)
router.get('/published', ArtifactController.getPublishedArtifacts)

// Protected routes (require authentication)
router.post('/', authenticate, ArtifactController.createArtifact)
router.post('/:artifactId/generate', authenticate, ArtifactController.generateArtifact)
router.post('/:artifactId/publish', authenticate, ArtifactController.publishArtifact)
router.get('/my-artifacts', authenticate, ArtifactController.getUserArtifacts)
router.post('/:artifactId/like', authenticate, ArtifactController.toggleLike)
router.post('/:artifactId/comments', authenticate, ArtifactController.addComment)

export default router