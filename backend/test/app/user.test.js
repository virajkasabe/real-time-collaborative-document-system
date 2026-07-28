import request from "supertest";
import { app } from "../../src/app.js";

describe("Auth - Register", () => {
  it("should register a new user successfully", async () => {
    const payload = {
      name: "Laxman",
      email: "test@test.com",
      password: "12345678",
    };

    const response = await request(app)
      .post("/api/v1/rtcds/auth/register")
      .send(payload);

    console.log({
      status: response.status,
      body: response.body,
    });

    expect(response.status).toBe(201);
  });
});