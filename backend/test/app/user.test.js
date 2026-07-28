import request from "supertest";
import { app } from "../../src/app.js";

describe("Register", () => {
  test("should register user", async () => {
    const res = await request(app)
      .post("/api/v1/rtcds/auth/register")
      .send({
        name: "Laxman",
        email: "test@test.com",
        password: "12345678",
      });

    expect(res.status).toBe(201);
  });
});