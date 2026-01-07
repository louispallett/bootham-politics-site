import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PutValidation = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(100),
});

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  try {
    if (!token) {
      throw new HttpError("No token provided", 403);
    }

    await connectToDB();

    const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ["HS256"],
    }) as { userId: string };
    const userId = decoded.userId;

    const body = await req.json();

    const parsed = PutValidation.safeParse(body);
    if (!parsed.success) throw new HttpError(parsed.error.message, 400);
    const { firstName, lastName, email } = parsed.data;

    const user = await User.findById(userId);
    if (!user) throw new HttpError("User not found", 404);

    await User.updateOne(
      { _id: userId },
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
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
