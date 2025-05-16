import { NextResponse } from "next/server";
import Tag from "@/models/Tag";
import { connectToDB } from "@/lib/db";
import { z } from "zod";
import mongoose from "mongoose";

const Validation = z.object({
    name: z.string().trim().max(100),
});

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

const PutValidation = z.object({
    tagId: z.string().trim().refine(
        (v) => mongoose.Types.ObjectId.isValid(v),
        {
            message: "Invalid tag ID"
        }
    ),
    name: z.string().trim().max(100)
});

export async function PUT(req:Request) {
    try {
        const data = await req.json();
        const promises = [];
    
        for (let key in data) {
            const parsed = PutValidation.safeParse({ tagId: key, name: data[key] });
            
            if (!parsed.success) {
                console.log(parsed.error.message);
                return NextResponse.json({ error: parsed.error.message }, { status: 400 });
            }
    
            const { tagId, name } = parsed.data;

            promises.push(
                Tag.updateOne({ _id: tagId }, { name: name })
            );
        }

        await Promise.all(promises);
    
        return new NextResponse(null, { status: 204 });
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
        const body = await req.json();

        const parsed = Validation.safeParse(body);
        if(!parsed.success) {
            return NextResponse.json({
                message: "Validation Errors",
                errors: parsed.error.flatten().fieldErrors,
            }, { status: 400 });
        }

        const { name } = parsed.data;
        
        const tagExists = await Tag.findOne({ name });
        if (tagExists) {
            return NextResponse.json({ message: "Tag already exists" }, { status: 409 });
        }

        const tag = await Tag.create({ name });

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