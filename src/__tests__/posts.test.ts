import { GET, POST, PUT } from "@/app/api/posts/route";
import Post from "@/models/Post";

describe("API for Post route", () => {
    describe("API for Post model(1)", () => {
        it("Creates a post", async () => {
            const req = new Request("http://localhost/api/posts", {
                method: "POST",
                body: JSON.stringify({ 
                    title: "Test Post", 
                    content: "Test content",
                }),
                headers: { "Content-Type": "application/json" }
            });
    
            const res = await POST(req);
            const json = await res.json();
            
            expect(res.status).toBe(201);
            expect(json.title).toBe("Test Post");
        });
    
    });
    
    describe("API for Post model(2)", () => {
        beforeAll(async () => {
            await Post.create({ 
                title: "Test", 
                content: "Test content" 
            });
        });
    
        it("Gets all posts", async () => {
            const res = await GET();
            const json = await res.json();
        
            expect(res.status).toBe(200);
            expect(json.length).toBe(1);
            expect(json[0].content).toBe("Test content");
        });
    
        it("Updates a post", async () => {
            const req = new Request("http://localhost/api/posts", {
                method: "PUT",
                body: JSON.stringify({ 
                    title: "Test Post", 
                    content: "Updated content",
                }),
                headers: { "Content-Type": "application/json" }
            });
    
            const res = await PUT(req);
    
            expect(res.status).toBe(204);
        });
    })
})
