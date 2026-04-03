import { Types } from "mongoose";
import mongoose, { Schema, model, models } from "mongoose";

// The core Activity interface that powers your entire dashboard logic
export interface IActivity {
  _id?: string | Types.ObjectId; // MongoDB unique ID
  userId: string | Types.ObjectId; // Reference to the logged-in user
  title: string; // e.g., "Commuted via Metro"
  
  // Categorization for your "Math" and charts
  category: "Transportation" | "Waste" | "Energy" | "Planting";
  
  // The metrics derived from this specific action
  creditsEarned: number; 
  co2Offset: number; // calculated in kg
  energySaved: number; // calculated in kWh
  
  // Admin approval flow logic
  status: "pending" | "approved" | "rejected";
  
  // This Date object is what colors your GitHub-style grid
  createdAt: Date;
  updatedAt?: Date;

  verificationMetadata?: {
    extractedDate?: string;
    extractedStation?: string;
    userLocation?: { lat: number; lng: number };
    distanceToStation?: number;
    aiAuditReason?: string;
  };
  proofImage?: string;
}

// A helper type for the 'Stat Cards' at the top of your dashboard
export interface IDashboardStats {
  totalCredits: number;
  totalCo2Saved: number;
  totalEnergySaved: number;
  globalRank?: number;
}


const ActivitySchema = new Schema<IActivity>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true }, // e.g., "Planted 5 Trees"
  category: { 
    type: String, 
    enum: ["Transportation", "Waste", "Energy", "Planting"],
    required: true 
  },
  creditsEarned: { type: Number, default: 0 },
  co2Offset: { type: Number, default: 0 }, // calculated in kg
  energySaved: { type: Number, default: 0 }, // calculated in kWh
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },
  verificationMetadata: {
    extractedDate: String,
    extractedStation: String,
    userLocation: { lat: Number, lng: Number },
    distanceToStation: Number,
    aiAuditReason: String,
  },
  proofImage: { type: String, required: false },
});

// Indexes for Dashboard performance optimizations
ActivitySchema.index({ userId: 1, status: 1 });
ActivitySchema.index({ userId: 1, createdAt: -1 });

const Activity = models.Activity || model("Activity", ActivitySchema);
export default Activity;