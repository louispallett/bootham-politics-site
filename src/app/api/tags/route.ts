import { NextResponse } from "next/server";
import Tag from "@/models/Tag";
import { connectToDB } from "@/lib/db";

export async function GET() {
    try {
        await connectToDB();

        const tags = await Tag.find();
        if (!tags) {
            throw new Error("Error fetching tags");
        }

        return NextResponse.json({ tags }, { status: 200 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }   
}

export async function POST(req:Request) {
    try {
        await connectToDB();

        const data = await req.json();
        
        const tagExists = await Tag.findOne({ name: data.name });
        if (tagExists) {
            return NextResponse.json({ message: "Tag already exists" }, { status: 409 });
        }

        const tag = await Tag.create({
            name: data.name
        });

        if (!tag) {
            throw new Error("Database connection failure");
        }

        return NextResponse.json({ name: tag.name }, { status: 201 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }   
}

export async function PUT(req:Request) {
    try {
        await connectToDB();

        const data = await req.json();
        await Tag.updateOne(
            { _id: data._id },
            { name: data.name }
        );

        return new NextResponse(null, { status: 204 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }   
}