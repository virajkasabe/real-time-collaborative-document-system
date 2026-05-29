import mongoose from 'mongoose'
import {ENV} from '../config/ENV.js'

export  const connectDB = async() => {
  try {
        const promise = await mongoose.connect(ENV.MONGODB_URI)
        return promise;
  } catch (error) {
      console.error("MONGOOSE CONNECTION ERROR", error.message)
        process.exit(1)
  }
}
