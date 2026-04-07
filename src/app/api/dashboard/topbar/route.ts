import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import type { DashboardTopbarResponse } from "@/lib/dashboardTopbar";
import Activity from "@/models/Activity";
import Notification from "@/models/Notification";
import User, { type IUser } from "@/models/User";

export const dynamic = "force-dynamic";

interface NotificationRaw {
  _id: { toString(): string } | string;
  kind: "login" | "activity";
  title: string;
  message: string;
  href?: string | null;
  isSeen?: boolean;
  createdAt: Date | string;
}

interface RecentActivityRaw {
  _id: { toString(): string } | string;
  title: string;
  category: "Transportation" | "Waste" | "Energy" | "Planting";
  creditsEarned: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date | string;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const userInDb = (await User.findOne({ email: session.user.email })) as IUser | null;

  if (!userInDb) {
    return NextResponse.json({ error: "User profile not found in database." }, { status: 404 });
  }

  const [notificationsRaw, recentActivitiesRaw] = await Promise.all([
    Notification.find({ userId: userInDb._id })
      .sort({ createdAt: -1 })
      .limit(8)
      .select("_id kind title message href isSeen createdAt")
      .lean<NotificationRaw[]>(),
    Activity.find({ userId: userInDb._id })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("_id title category creditsEarned status createdAt")
      .lean<RecentActivityRaw[]>(),
  ]);

  const response: DashboardTopbarResponse = {
    notifications: notificationsRaw.map((notification) => ({
      _id: notification._id.toString(),
      kind: notification.kind,
      title: notification.title,
      message: notification.message,
      href: notification.href || null,
      isSeen: Boolean(notification.isSeen),
      createdAt:
        notification.createdAt instanceof Date
          ? notification.createdAt.toISOString()
          : new Date(notification.createdAt).toISOString(),
    })),
    recentActivities: recentActivitiesRaw.map((activity) => ({
      _id: activity._id.toString(),
      title: activity.title,
      category: activity.category,
      creditsEarned: activity.creditsEarned,
      status: activity.status,
      createdAt:
        activity.createdAt instanceof Date
          ? activity.createdAt.toISOString()
          : new Date(activity.createdAt).toISOString(),
    })),
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function PATCH() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const userInDb = (await User.findOne({ email: session.user.email })) as IUser | null;

  if (!userInDb) {
    return NextResponse.json({ error: "User profile not found in database." }, { status: 404 });
  }

  const result = await Notification.updateMany(
    {
      userId: userInDb._id,
      isSeen: { $ne: true },
    },
    {
      $set: { isSeen: true },
    }
  );

  return NextResponse.json(
    { success: true, updatedCount: result.modifiedCount ?? 0 },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
