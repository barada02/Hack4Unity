import { ObjectId } from 'mongodb'

export interface Profile {
  _id?: ObjectId
  userId: ObjectId
  displayName: string
  bio?: string
  country?: string
  interests?: string[]
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface ProfileInput {
  displayName: string
  bio?: string
  country?: string
  interests?: string[]
  avatarUrl?: string
}

export interface ProfileResponse {
  _id: string
  userId: string
  displayName: string
  bio?: string
  country?: string
  interests?: string[]
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}