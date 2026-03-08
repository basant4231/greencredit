import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema: Schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 600 // This automatically deletes the document after 10 minutes!
  }
});

export default mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);