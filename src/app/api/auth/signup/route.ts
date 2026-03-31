import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { sendOtpEmail } from "@/lib/mailer";
import Otp from "@/models/Otp";
import User from "@/models/User";

export const runtime = "nodejs";

interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = (await request.json()) as Partial<SignupRequestBody>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || password.length < 8) {
      return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const generatedOtp = crypto.randomInt(100000, 999999).toString();
    const [otpHash, passwordHash] = await Promise.all([
      bcrypt.hash(generatedOtp, 10),
      bcrypt.hash(password, 10),
    ]);

    await Otp.findOneAndUpdate(
      { email },
      { name, passwordHash, otpHash, createdAt: new Date() },
      { upsert: true, new: true }
    );

    try {
      await sendOtpEmail({
        to: email,
        name,
        otp: generatedOtp,
      });
    } catch (mailError) {
      await Otp.deleteOne({ email }).catch(() => undefined);
      throw mailError;
    }

    return NextResponse.json({
      message: "OTP sent successfully",
      email,
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("OTP mail error:", error);
    return NextResponse.json({ message: "Failed to send OTP", error: getErrorMessage(error) }, { status: 500 });
  }
}
