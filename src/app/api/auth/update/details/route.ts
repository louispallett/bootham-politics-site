import objectIdSchema from "@/app/api/objectIdSchema";
import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PutValidation = z.object({
  userId: objectIdSchema,
  data: z.object({
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(50),
    email: z.string().trim().email().max(100),
  }),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDB();

    const body = await req.json();

    const { id } = await params;
    const parsed = PutValidation.safeParse({ userId: id, data: body.data });
    if (!parsed.success) throw new HttpError(parsed.error.message, 400);
    const { userId, data } = parsed.data;

    const user = await User.findById(userId);
    if (!user) throw new HttpError("User not found", 404);

    await User.updateOne(
      { _id: userId },
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
    );

    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
