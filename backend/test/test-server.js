
import { redisConnect, client } from "../src/redis.js";
import { createServer } from "../src/server.js";
import connectDB from "./db.js";

let server;
let io;

beforeAll(async () => {
    // Mongo
    console.log("db connecting soon")
    await connectDB()

    // Redis
    await redisConnect();

    // HTTP + Socket.IO
    const result = await createServer();

    server = result.server;
    io = result.io;
});

afterEach(async () => {
    // Clear collections
    await User.deleteMany({});
});

afterAll(async () => {
    await io.close();

    await new Promise((resolve) => server.close(resolve));

    await client.quit();

    mongoose.connection.close();
});