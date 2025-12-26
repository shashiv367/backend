import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Database statistics route
app.get('/api/db/stats', async (req, res) => {
  try {
    const db = mongoose.connection.db
    
    // Get database stats
    const dbStats = await db.stats()
    
    // Get list of collections
    const collections = await db.listCollections().toArray()
    
    // Get stats for each collection
    const collectionStats = await Promise.all(
      collections.map(async (collection) => {
        const stats = await db.collection(collection.name).stats()
        return {
          name: collection.name,
          count: stats.count || 0,
          size: stats.size || 0,
          sizeMB: ((stats.size || 0) / (1024 * 1024)).toFixed(2),
          storageSize: stats.storageSize || 0,
          storageSizeMB: ((stats.storageSize || 0) / (1024 * 1024)).toFixed(2),
          indexSize: stats.totalIndexSize || 0,
          indexSizeMB: ((stats.totalIndexSize || 0) / (1024 * 1024)).toFixed(2),
          avgObjSize: stats.avgObjSize || 0
        }
      })
    )
    
    res.json({
      database: db.databaseName,
      stats: {
        dataSize: dbStats.dataSize,
        dataSizeMB: (dbStats.dataSize / (1024 * 1024)).toFixed(2),
        storageSize: dbStats.storageSize,
        storageSizeMB: (dbStats.storageSize / (1024 * 1024)).toFixed(2),
        indexSize: dbStats.indexSize,
        indexSizeMB: (dbStats.indexSize / (1024 * 1024)).toFixed(2),
        totalSize: dbStats.dataSize + dbStats.indexSize,
        totalSizeMB: ((dbStats.dataSize + dbStats.indexSize) / (1024 * 1024)).toFixed(2),
        collections: dbStats.collections,
        objects: dbStats.objects
      },
      collections: collectionStats
    })
  } catch (error) {
    console.error('Error fetching database stats:', error)
    res.status(500).json({ message: 'Error fetching database statistics', error: error.message })
  }
})

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp'
const PORT = process.env.PORT || 5000

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  })

export default app

