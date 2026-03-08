import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define the Interface (This is what you were missing!)
// This tells TypeScript what a User object looks like in your code.
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string; // Optional because we often hide it
  role: 'user' | 'admin';
  totalCredits: number;
  createdAt: Date;
}

// 2. Define the Schema (This tells MongoDB how to store the data)
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, select: false },
  image :{type :String , required   : false},
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  totalCredits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// 3. Export the Model
// We tell Mongoose to use the IUser interface so our queries are typed.
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;