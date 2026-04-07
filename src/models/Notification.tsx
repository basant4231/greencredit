import { Types } from "mongoose";
import mongoose, { Schema, model, models } from "mongoose";

export interface INotification {
  _id?: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  kind: "login" | "activity";
  title: string;
  message: string;
  href?: string | null;
  isSeen?: boolean;
  createdAt?: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  kind: {
    type: String,
    enum: ["login", "activity"],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  href: {
    type: String,
    default: null,
  },
  isSeen: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;
