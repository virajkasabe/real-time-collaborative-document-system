import request from "supertest";
import { app } from "../../src/app.js";
import User from "../../src/module/auth/auth.model.js";

jest.mock("../../src/services/otp.service.js", () => ({
  emailVerifyLinkService: jest.fn().mockResolvedValue(true),
  otpService: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../src/redis/client.js", () => ({
  setOTP: jest.fn().mockResolvedValue(true),
  getOTP: jest.fn().mockResolvedValue(null),
  setUser: jest.fn().mockResolvedValue(true),
  getUser: jest.fn().mockResolvedValue(null),
}));

describe("Auth - Register", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should register a new user successfully", async () => {
    const fakeUser = {
      _id: "fakeid123",
      fullName: "Laxman",
      email: "test@test.com",
      generateTemporaryToken: jest.fn().mockReturnValue({
        unHashedToken: "token123",
        hashedToken: "hashed123",
        tokenExpiry: Date.now() + 3600000,
      }),
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(User, "findOne").mockResolvedValue(null);
    jest.spyOn(User, "create").mockResolvedValue(fakeUser);
    jest.spyOn(User, "findById").mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser),
    });

    const payload = {
      name: "Laxman",
      email: "test@test.com",
      password: "12345678",
    };

    const response = await request(app)
      .post("/api/v1/rtcds/auth/register")
      .send(payload);

    expect(response.status).toBe(201);
  });
});