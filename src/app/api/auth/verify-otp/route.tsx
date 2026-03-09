import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import Otp from '@/models/Otp';
import User from '@/models/User';

interface VerifyOtpRequestBody {
  email: string;
  otp: string;
  name?: string;
  password?: string;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = (await request.json()) as Partial<VerifyOtpRequestBody>;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const otp = typeof body.otp === "string" ? body.otp.trim() : "";
    const fallbackName = typeof body.name === "string" ? body.name.trim() : "";
    const fallbackPassword = typeof body.password === "string" ? body.password : "";

    if (!email || !otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    // 1. Find the OTP record by email
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    const otpHash = typeof otpRecord.otpHash === "string" ? otpRecord.otpHash : "";
    const legacyOtp = (otpRecord as unknown as { otp?: string }).otp;
    const otpMatches = otpHash ? await bcrypt.compare(otp, otpHash) : legacyOtp === otp;
    if (!otpMatches) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json({ message: "User already exists. Please log in." }, { status: 409 });
    }

    const nameToStore = otpRecord.name || fallbackName;
    let passwordHashToStore = otpRecord.passwordHash || "";
    if (!passwordHashToStore && fallbackPassword.length >= 8) {
      passwordHashToStore = await bcrypt.hash(fallbackPassword, 10);
    }

    if (!nameToStore || !passwordHashToStore) {
      return NextResponse.json(
        { message: "Signup session expired. Please sign up again to request a new OTP." },
        { status: 400 }
      );
    }

    // 2. Create the real User with data captured during signup
    await User.create({
      name: nameToStore,
      email,
      password: passwordHashToStore,
    });

    // 3. Delete the OTP record so it can't be used again
    await Otp.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });

  } catch (error: unknown) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
  }
}
