import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  email: string
  password: string // hashed password
  createdAt: Date
  updatedAt: Date
}

export interface UserCredentials {
  email: string
  password: string
}

export interface UserResponse {
  _id: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface LoginResponse {
  user: UserResponse
  token: string
}