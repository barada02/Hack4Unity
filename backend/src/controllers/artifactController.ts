import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import Database from '../config/database'
import { CloudStorageService } from '../services/cloudStorage'
import { Artifact, ArtifactInput, ArtifactResponse, CommentResponse, Comment } from '../models/Artifact'
import Joi from 'joi'

// Validation schemas
const artifactInputSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  expression: Joi.string().min(1).max(2000).required(),
  format: Joi.string().valid('png', 'gif').optional().default('png'),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional()
})

const commentSchema = Joi.object({
  comment: Joi.string().min(1).max(500).required()
})

export class ArtifactController {
  // Create new artifact (draft)
  static async createArtifact(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = artifactInputSchema.validate(req.body)
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        })
        return
      }

      const userId = new ObjectId(req.user!.userId)
      const db = Database.getInstance().getDb()

      // Get user profile for artifact ID generation
      const profile = await db.collection('profiles').findOne({ userId })
      const displayName = profile?.displayName

      // Generate unique artifact ID
      const artifactId = CloudStorageService.generateArtifactId(req.user!.userId, displayName)

      const now = new Date()
      const artifact: Artifact = {
        artifactId,
        userId,
        title: value.title,
        expression: value.expression,
        format: value.format,
        status: 'draft',
        likes: [],
        comments: [],
        tags: value.tags,
        createdAt: now,
        updatedAt: now
      }

      const result = await db.collection<Artifact>('artifacts').insertOne(artifact)

      res.status(201).json({
        success: true,
        message: 'Artifact created successfully',
        data: {
          _id: result.insertedId.toString(),
          artifactId: artifact.artifactId,
          title: artifact.title,
          expression: artifact.expression,
          format: artifact.format,
          status: artifact.status
        }
      })
    } catch (error) {
      console.error('Create artifact error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Generate artifact image
  static async generateArtifact(req: Request, res: Response): Promise<void> {
    try {
      const { artifactId } = req.params
      const userId = new ObjectId(req.user!.userId)
      const db = Database.getInstance().getDb()

      // Find the artifact and verify ownership
      const artifact = await db.collection<Artifact>('artifacts').findOne({
        artifactId,
        userId
      })

      if (!artifact) {
        res.status(404).json({
          success: false,
          message: 'Artifact not found or access denied'
        })
        return
      }

      if (artifact.imageUrl) {
        res.status(400).json({
          success: false,
          message: 'Artifact image already generated'
        })
        return
      }

      // Generate artifact using Cloud Run service
      const generationResult = await CloudStorageService.generateArtifact(
        artifact.expression,
        artifact.format,
        artifact.artifactId
      )

      if (!generationResult.success || !generationResult.image_url) {
        res.status(500).json({
          success: false,
          message: 'Failed to generate artifact',
          error: generationResult.error || 'Unknown generation error'
        })
        return
      }

      // Update artifact with image URL
      await db.collection<Artifact>('artifacts').updateOne(
        { artifactId, userId },
        { 
          $set: { 
            imageUrl: generationResult.image_url,
            updatedAt: new Date()
          } 
        }
      )

      res.status(200).json({
        success: true,
        message: 'Artifact generated successfully',
        data: {
          artifactId: artifact.artifactId,
          imageUrl: generationResult.image_url,
          expression: artifact.expression,
          format: artifact.format
        }
      })
    } catch (error) {
      console.error('Generate artifact error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Publish artifact
  static async publishArtifact(req: Request, res: Response): Promise<void> {
    try {
      const { artifactId } = req.params
      const userId = new ObjectId(req.user!.userId)
      const db = Database.getInstance().getDb()

      const artifact = await db.collection<Artifact>('artifacts').findOne({
        artifactId,
        userId
      })

      if (!artifact) {
        res.status(404).json({
          success: false,
          message: 'Artifact not found or access denied'
        })
        return
      }

      if (!artifact.imageUrl) {
        res.status(400).json({
          success: false,
          message: 'Cannot publish artifact without generated image'
        })
        return
      }

      if (artifact.status === 'published') {
        res.status(400).json({
          success: false,
          message: 'Artifact is already published'
        })
        return
      }

      const now = new Date()
      await db.collection<Artifact>('artifacts').updateOne(
        { artifactId, userId },
        { 
          $set: { 
            status: 'published',
            publishedAt: now,
            updatedAt: now
          } 
        }
      )

      res.status(200).json({
        success: true,
        message: 'Artifact published successfully'
      })
    } catch (error) {
      console.error('Publish artifact error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Get user's artifacts
  static async getUserArtifacts(req: Request, res: Response): Promise<void> {
    try {
      const userId = new ObjectId(req.user!.userId)
      const db = Database.getInstance().getDb()

      const artifacts = await db.collection<Artifact>('artifacts')
        .find({ userId })
        .sort({ updatedAt: -1 })
        .toArray()

      const artifactsResponse: ArtifactResponse[] = artifacts.map(artifact => ({
        _id: artifact._id!.toString(),
        artifactId: artifact.artifactId,
        userId: artifact.userId.toString(),
        title: artifact.title,
        expression: artifact.expression,
        imageUrl: artifact.imageUrl,
        format: artifact.format,
        status: artifact.status,
        likes: artifact.likes.map(id => id.toString()),
        comments: artifact.comments.map(comment => ({
          _id: comment._id?.toString() || '',
          userId: comment.userId.toString(),
          userName: comment.userName,
          comment: comment.comment,
          createdAt: comment.createdAt
        })),
        tags: artifact.tags,
        createdAt: artifact.createdAt,
        updatedAt: artifact.updatedAt,
        publishedAt: artifact.publishedAt,
        likesCount: artifact.likes.length
      }))

      res.status(200).json({
        success: true,
        data: artifactsResponse
      })
    } catch (error) {
      console.error('Get user artifacts error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Get published artifacts (showcase)
  static async getPublishedArtifacts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 12
      const skip = (page - 1) * limit

      const db = Database.getInstance().getDb()
      const currentUserId = req.user ? new ObjectId(req.user.userId) : null

      // Get published artifacts with author info
      const artifacts = await db.collection<Artifact>('artifacts').aggregate([
        { $match: { status: 'published' } },
        { $sort: { publishedAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'profiles',
            localField: 'userId',
            foreignField: 'userId',
            as: 'authorProfile'
          }
        },
        {
          $addFields: {
            author: {
              $let: {
                vars: { profile: { $arrayElemAt: ['$authorProfile', 0] } },
                in: {
                  displayName: { $ifNull: ['$$profile.displayName', 'Anonymous'] },
                  avatarUrl: '$$profile.avatarUrl'
                }
              }
            }
          }
        },
        { $unset: 'authorProfile' }
      ]).toArray()

      const artifactsResponse: ArtifactResponse[] = artifacts.map(artifact => ({
        _id: artifact._id!.toString(),
        artifactId: artifact.artifactId,
        userId: artifact.userId.toString(),
        title: artifact.title,
        expression: artifact.expression,
        imageUrl: artifact.imageUrl,
        format: artifact.format,
        status: artifact.status,
        likes: artifact.likes.map((id: ObjectId) => id.toString()),
        comments: artifact.comments.map((comment: Comment) => ({
          _id: comment._id?.toString() || '',
          userId: comment.userId.toString(),
          userName: comment.userName,
          comment: comment.comment,
          createdAt: comment.createdAt
        })),
        tags: artifact.tags,
        createdAt: artifact.createdAt,
        updatedAt: artifact.updatedAt,
        publishedAt: artifact.publishedAt,
        likesCount: artifact.likes.length,
        isLikedByUser: currentUserId ? artifact.likes.some((id: ObjectId) => id.equals(currentUserId)) : false,
        author: (artifact as any).author
      }))

      res.status(200).json({
        success: true,
        data: artifactsResponse,
        pagination: {
          page,
          limit,
          hasMore: artifacts.length === limit
        }
      })
    } catch (error) {
      console.error('Get published artifacts error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Toggle like on artifact
  static async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const { artifactId } = req.params
      const userId = new ObjectId(req.user!.userId)
      const db = Database.getInstance().getDb()

      const artifact = await db.collection<Artifact>('artifacts').findOne({
        artifactId,
        status: 'published'
      })

      if (!artifact) {
        res.status(404).json({
          success: false,
          message: 'Published artifact not found'
        })
        return
      }

      const isLiked = artifact.likes.some(id => id.equals(userId))
      
      if (isLiked) {
        // Remove like
        await db.collection<Artifact>('artifacts').updateOne(
          { artifactId },
          { 
            $pull: { likes: userId },
            $set: { updatedAt: new Date() }
          }
        )
      } else {
        // Add like
        await db.collection<Artifact>('artifacts').updateOne(
          { artifactId },
          { 
            $addToSet: { likes: userId },
            $set: { updatedAt: new Date() }
          }
        )
      }

      res.status(200).json({
        success: true,
        message: isLiked ? 'Like removed' : 'Like added',
        data: {
          isLiked: !isLiked,
          likesCount: artifact.likes.length + (isLiked ? -1 : 1)
        }
      })
    } catch (error) {
      console.error('Toggle like error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Add comment to artifact
  static async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = commentSchema.validate(req.body)
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        })
        return
      }

      const { artifactId } = req.params
      const userId = new ObjectId(req.user!.userId)
      const db = Database.getInstance().getDb()

      // Get user profile for comment
      const profile = await db.collection('profiles').findOne({ userId })
      const userName = profile?.displayName || 'Anonymous'

      const artifact = await db.collection<Artifact>('artifacts').findOne({
        artifactId,
        status: 'published'
      })

      if (!artifact) {
        res.status(404).json({
          success: false,
          message: 'Published artifact not found'
        })
        return
      }

      const comment: Comment = {
        _id: new ObjectId(),
        userId,
        userName,
        comment: value.comment,
        createdAt: new Date()
      }

      await db.collection<Artifact>('artifacts').updateOne(
        { artifactId },
        { 
          $push: { comments: comment },
          $set: { updatedAt: new Date() }
        }
      )

      const commentResponse: CommentResponse = {
        _id: comment._id!.toString(),
        userId: comment.userId.toString(),
        userName: comment.userName,
        comment: comment.comment,
        createdAt: comment.createdAt
      }

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: commentResponse
      })
    } catch (error) {
      console.error('Add comment error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}