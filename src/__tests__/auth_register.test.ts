import { POST } from "@/app/api/auth/register/route";
// import bcrypt from "bcryptjs";

describe("API for User model", () => {
    it("Creates a user", async () => {
        const req = new Request("http://localhost/api/users", {
            method: "POST",
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                email: "John.Doe@example.com",
                password: "HelloWorld1!"
            }),
            headers: { "Content-Type": "application/json" }
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(201);
        expect(res.fullName).toBe("John Doe");
        //? Below tests that the password is hashed in the same method as bcrypt 
        //? (not that the two strings are the same)
        // expect(await bcrypt.compare("HelloWorld1!", res.password)).toBe(true);
    });
});