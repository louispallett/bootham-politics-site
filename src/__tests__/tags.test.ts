import { GET, POST, PUT } from "@/app/api/tags/route";
import Tag from "@/models/Tag";

describe.skip("API for Tag model", () => {
    it("Creates a tag", async () => {
        const req = new Request("http://localhost/api/tags", {
            method: "POST", 
            body: JSON.stringify({
                name: "British Politics"
            }),
            headers: { "Content-Type": "application/json" }
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(201);
        expect(json.name).toBe("British Politics");
    });

    describe("API for Tag model (2)", () => {
        beforeAll(async () => {
            await Tag.create({
                name: "British Politics"
            });
        });
    
        it("Gets all tags", async () => {
            const req = new Request("http://localhost/api/tags", {
                method: "GET"
            });
    
            const res = await GET();
            const json = await res.json();
    
            expect(res.status).toBe(200);
            expect(json[0].name).toBe("British Politics");
        });
    
        it("Throws error if Tag already exists", async () => {
            const req = new Request("http://localhost/api/tags", {
                method: "POST", 
                body: JSON.stringify({
                    name: "British Politics"
                }),
                headers: { "Content-Type": "application/json" }
            });
    
            const res = await POST(req);
            
            expect(res.status).toBe(409);
        });
    
        it("Updates a tag", async () => {
            const req = new Request("http://localhost/api/tags", {
                method: "PUT", 
                body: JSON.stringify({
                    name: "Irish Politics"
                }),
                headers: { "Content-Type": "application/json" }
            });
    
            const res = await PUT(req);
    
            expect(res.status).toBe(204);
        })
    });
})
