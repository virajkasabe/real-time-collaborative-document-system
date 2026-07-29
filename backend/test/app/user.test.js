import request from "supertest";
import { app } from "../../src/app.js";
import connectDB from "../db.js";
import { redisTestConnector } from '../redis-server.js';
import { backendUrl } from "../comman.js";

beforeAll(async () => {
  await connectDB();
  await redisTestConnector();
});

describe("Auth - Register", () => {
  it("should register a new user successfully", async () => {
    const payload = {
      fullName: "Laxman",
      email: "test@test.com",
      password: "12345678",
    };

    const response = await request(app)
      .post(`${backendUrl}/auth/register`)
      .send(payload);


    expect(response.status).toBe(201);
  });
});