import { POST } from "@/app/api/auth/register/route";

describe("API for User model", () => {
    it("Creates a user", async () => {
        const req = new Request("http://localhost/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "John.Doe@example.com",
                password: "HelloWorld1!",
                passkey: process.env.PASS_KEY
            }),
            headers: { "Content-Type": "application/json" }
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(201);
        expect(json.firstName).toBe("John");
    });

    it("Returns error with invalid pass key", async () => {
            const req = new Request("http://localhost/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "John.Doe@example.com",
                password: "HelloWorld1!",
                passkey: "wrong"
            }),
            headers: { "Content-Type": "application/json" }
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.message).toBe("Invalid Pass Key");
    })
});