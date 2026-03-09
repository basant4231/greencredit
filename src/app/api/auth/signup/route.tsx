import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from "bcryptjs";
import { Resend } from 'resend'; // 1. Import Resend
import dbConnect from '@/lib/dbConnect';
import Otp from '@/models/Otp';
import User from '@/models/User';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Basic server-side validation
    if (!name || !email || password.length < 8) {
      return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    // Generate 6-digit OTP
    const generatedOtp = crypto.randomInt(100000, 999999).toString();
    const [otpHash, passwordHash] = await Promise.all([
      bcrypt.hash(generatedOtp, 10),
      bcrypt.hash(password, 10),
    ]);

    // Store/Update OTP in MongoDB
    await Otp.findOneAndUpdate(
      { email },
      { name, passwordHash, otpHash, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // 2. Send the Email via Resend
    // Note: On the Resend free tier, you can only send to your own email 
    // until you verify a custom domain.
    await resend.emails.send({
      from: 'EcoCredit <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your EcoCredit Account',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Welcome to EcoCredit, ${name}!</h2>
          <p>Your verification code is below. It will expire in 5 minutes.</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 10px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #059669;">
              ${generatedOtp}
            </span>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ 
      message: "OTP sent successfully", 
      email 
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("Resend Error:", error);
    return NextResponse.json({ message: "Failed to send OTP", error: getErrorMessage(error) }, { status: 500 });
  }
}
