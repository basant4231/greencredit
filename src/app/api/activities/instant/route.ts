import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Activity from "@/models/Activity";

const activityMap = {
  Metro: { title: "Commuted by Metro", credits: 10, co2: 2, energy: 5, category: "Transportation" },
  Tree: { title: "Planted a Tree", credits: 50, co2: 20, energy: 0, category: "Planting" },
  Solar: { title: "Used Solar Power", credits: 30, co2: 15, energy: 25, category: "Energy" },
} as const;

type ActivityType = keyof typeof activityMap;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, type } = (await req.json()) as {
      userId?: string;
      type?: ActivityType;
    };

    if (!userId || !type || !(type in activityMap)) {
      return NextResponse.json({ error: "Invalid activity request" }, { status: 400 });
    }

    const activityData = activityMap[type];

    const newActivity = await Activity.create({
      userId,
      title: activityData.title,
      category: activityData.category,
      creditsEarned: activityData.credits,
      co2Offset: activityData.co2,
      energySaved: activityData.energy,
      status: "approved", // Verification skipped as requested
    });

    return NextResponse.json({ success: true, activity: newActivity });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create activity";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
