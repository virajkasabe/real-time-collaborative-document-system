import { MongoMemoryServer } from 'mongodb-memory-server'
import { ENV } from '../src/config/ENV.js';
import { connections, mongoose } from 'mongoose';

const MONGO_MEMORY_SERVER_PORT = ENV.MONGO_MEMORY_SERVER_PORT || 10000;
const MONGODB_URL = ENV.MONGODB_URI

let mongodbServer = null; 
let dbInstance = undefined;

const connectedDBForTesting = () => {
    try {
        await mongoose.disconnect();
        mongodbServer = await MongoMemoryServer.create({
            instance : {
                port : +MONGO_MEMORY_SERVER_PORT
            }
        })
        dbInstance = await mongoose.connect(MONGODB_URL)
    } catch (error) {
        console.error("Mongo db connect error: ", error);
        process.exit(1);
    }
}

export const clearDB = async(collectionName = null) => {
    if(!dbInstance) {
        dbInstance = await mongoose.connect(MONGODB_URL)
    }

    const connection = mongoose.connection;
    if(collectionName) {
        await connection.db.collection(collectionName).deleteMany({})
    } else {
        const collections = await connection.db.listConnection().toArray();
        const collectionNames = await connections.map((col)=> col.name)
        for(let name of collectionNames) {
            await connection.db.collection(name).deleteMany({})
        } 
    }
} 

export {
    connectedDBForTesting
} 