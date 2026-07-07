// const request = require("supertest");
// const { app } = require("../src/app.js");
import request from "supertest";
import { app } from "../src/app.js";

describe("Auth Routes", () => {
  test("POST /login", async () => {
    const res = await request(app)
      .post("/api/v1/rtcds/auth/login")
      .send({
        email: "laxmanshinde@gmail.com",
        password: "shinde@gmail.com",
      });
    expect(res.statusCode).toBe(200);
  });
});
