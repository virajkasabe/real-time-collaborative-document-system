import request from "supertest";

describe("Register", () => {
    test("should register user", async () => {
        const res = await request("http://localhost:5001")
            .post("/api/auth/register")
            .send({
                name: "Laxman",
                email: "test@test.com",
                password: "12345678",
            });

        expect(res.status).toBe(201);
    });
});