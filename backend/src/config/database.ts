import { MongoClient, Db } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

class Database {
  private static instance: Database
  private client: MongoClient | null = null
  private db: Db | null = null

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async connect(): Promise<void> {
    try {
      const mongoUrl = process.env.MONGODB_URL
      if (!mongoUrl) {
        throw new Error('MONGODB_URL environment variable is not set')
      }

      this.client = new MongoClient(mongoUrl)
      await this.client.connect()
      const dbName = process.env.DATABASE_NAME || 'unity-hub-db'
      this.db = this.client.db(dbName)
      
      console.log('✅ Connected to MongoDB')
    } catch (error) {
      console.error('❌ MongoDB connection error:', error)
      throw error
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
      console.log('📴 Disconnected from MongoDB')
    }
  }
}

export default Database