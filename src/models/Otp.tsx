import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document {
  email: string;
  name: string;
  passwordHash: string;
  otpHash: string;
  createdAt: Date;
}

const OtpSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  otpHash: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Keep it aligned with the "5 minutes" email copy.
  },
});

const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);

export default Otp;
