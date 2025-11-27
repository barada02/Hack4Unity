import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import Database from '../config/database'
import { AuthUtils } from '../utils/auth'
import { userRegistrationSchema, userLoginSchema, profileSchema } from '../validation/schemas'
import { User, UserResponse, LoginResponse } from '../models/User'
import { Profile, ProfileInput, ProfileResponse } from '../models/Profile'

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const { error, value } = userRegistrationSchema.validate(req.body)
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        })
        return
      }

      const { email, password } = value
      const db = Database.getInstance().getDb()

      // Check if user already exists
      const existingUser = await db.collection<User>('users').findOne({ email })
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User already exists with this email'
        })
        return
      }

      // Hash password and create user
      const hashedPassword = await AuthUtils.hashPassword(password)
      const now = new Date()
      
      const user: User = {
        email,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now
      }

      const result = await db.collection<User>('users').insertOne(user)
      const userId = result.insertedId

      // Generate token
      const token = AuthUtils.generateToken(userId)

      // Create user response (without password)
      const userResponse: UserResponse = {
        _id: userId.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          token
        } as LoginResponse
      })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const { error, value } = userLoginSchema.validate(req.body)
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        })
        return
      }

      const { email, password } = value
      const db = Database.getInstance().getDb()

      // Find user
      const user = await db.collection<User>('users').findOne({ email })
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
        return
      }

      // Verify password
      const isValidPassword = await AuthUtils.comparePassword(password, user.password)
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
        return
      }

      // Generate token
      const token = AuthUtils.generateToken(user._id!)

      // Create user response (without password)
      const userResponse: UserResponse = {
        _id: user._id!.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token
        } as LoginResponse
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Get user profile
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = new ObjectId(req.user!.userId)
      const db = Database.getInstance().getDb()

      const profile = await db.collection<Profile>('profiles').findOne({ userId })
      
      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Profile not found'
        })
        return
      }

      const profileResponse: ProfileResponse = {
        _id: profile._id!.toString(),
        userId: profile.userId.toString(),
        displayName: profile.displayName,
        bio: profile.bio,
        country: profile.country,
        interests: profile.interests,
        avatarUrl: profile.avatarUrl,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }

      res.status(200).json({
        success: true,
        data: profileResponse
      })
    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Create or update user profile
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const { error, value } = profileSchema.validate(req.body)
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
      const now = new Date()

      const profileInput: ProfileInput = value
      
      // Check if profile exists
      const existingProfile = await db.collection<Profile>('profiles').findOne({ userId })
      
      if (existingProfile) {
        // Update existing profile
        const updateData = {
          ...profileInput,
          updatedAt: now
        }

        await db.collection<Profile>('profiles').updateOne(
          { userId },
          { $set: updateData }
        )

        const updatedProfile = await db.collection<Profile>('profiles').findOne({ userId })
        
        const profileResponse: ProfileResponse = {
          _id: updatedProfile!._id!.toString(),
          userId: updatedProfile!.userId.toString(),
          displayName: updatedProfile!.displayName,
          bio: updatedProfile!.bio,
          country: updatedProfile!.country,
          interests: updatedProfile!.interests,
          avatarUrl: updatedProfile!.avatarUrl,
          createdAt: updatedProfile!.createdAt,
          updatedAt: updatedProfile!.updatedAt
        }

        res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          data: profileResponse
        })
      } else {
        // Create new profile
        const profile: Profile = {
          userId,
          ...profileInput,
          createdAt: now,
          updatedAt: now
        }

        const result = await db.collection<Profile>('profiles').insertOne(profile)
        
        const profileResponse: ProfileResponse = {
          _id: result.insertedId.toString(),
          userId: profile.userId.toString(),
          displayName: profile.displayName,
          bio: profile.bio,
          country: profile.country,
          interests: profile.interests,
          avatarUrl: profile.avatarUrl,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt
        }

        res.status(201).json({
          success: true,
          message: 'Profile created successfully',
          data: profileResponse
        })
      }
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Get current user info
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = new ObjectId(req.user!.userId)
      const db = Database.getInstance().getDb()

      const user = await db.collection<User>('users').findOne(
        { _id: userId },
        { projection: { password: 0 } } // Exclude password
      )

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        })
        return
      }

      const userResponse: UserResponse = {
        _id: user._id!.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      res.status(200).json({
        success: true,
        data: userResponse
      })
    } catch (error) {
      console.error('Get current user error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}