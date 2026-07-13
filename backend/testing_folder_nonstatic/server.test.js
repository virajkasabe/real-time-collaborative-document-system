
import { httpServer } from "../src/app"
import { connectDB } from "../src/db"
import { RedisConnect } from '../src/redis/client'
import { ENV } from "../src/config/ENV"

const port = ENV.PORT || 5001

const startServer = () => {
    httpServer.listen(port, () => {
        console.log(` Server is Runing on port : ${port} `)
    })
}

try {
    await connectDB()
    await RedisConnect()
    await startServer()
} catch (error) {
    console.log("Mongo db connect error: ", err);
}