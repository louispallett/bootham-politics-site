import { connectToDB } from "@/lib/db";
import Document from "@/models/Document";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const documents = await Document.find();

    return NextResponse.json(documents);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
