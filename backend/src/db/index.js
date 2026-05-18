<<<<<<< HEAD
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
=======
/*

    mongoose connect here

*/
>>>>>>> 49577a8 (docs(backend): add initial documentation comments for modules and utilities)
