import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import Otp from '@/models/Otp';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, otp, name, password } = await request.json();

    // 1. Find the OTP in MongoDB
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    // 2. Hash the password now that the user is verified
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the real User
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Delete the OTP record so it can't be used again
    await Otp.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}