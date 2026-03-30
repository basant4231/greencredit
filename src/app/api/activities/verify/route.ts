import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { getDistanceInKm, NEAREST_METRO } from "@/lib/geoUtils";
import {
  verifyMetroTicketWithAI,
  type MetroTicketAIResult,
  type MetroTicketVerdict,
} from "@/lib/metroTicketAI";
import Activity from "@/models/Activity";
import User from "@/models/User";

export const runtime = "nodejs";

const activityMap = {
  Metro: {
    title: "Commuted by Metro",
    credits: 10,
    co2: 2,
    energy: 5,
    category: "Transportation",
  },
  Planting: {
    title: "Maintained a Home Plantation",
    credits: 25,
    co2: 8,
    energy: 0,
    category: "Planting",
  },
} as const;

type ActivityType = keyof typeof activityMap;

function isMetroTestModeEnabled() {
  return process.env.METRO_TEST_MODE === "true";
}

function getVerificationErrorMessage(message: string) {
  if (message.includes("API_KEY_INVALID") || message.includes("GEMINI_API_KEY")) {
    return "Ticket verification is temporarily unavailable. Please try again in a moment.";
  }

  if (message.toLowerCase().includes("json")) {
    return "Invalid or unclear metro ticket image.";
  }

  return "Ticket verification could not be completed right now. Please try again.";
}

function getMetroRejectionMessage(verdict: MetroTicketVerdict) {
  switch (verdict) {
    case "INVALID_NOT_METRO":
      return "Invalid image: this does not appear to be a metro ticket.";
    case "INVALID_LOW_CONFIDENCE":
      return "This image could not be confidently verified as a metro ticket.";
    case "INVALID_UNCLEAR_IMAGE":
    default:
      return "Image is too unclear to verify. Please upload a clearer metro ticket photo.";
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please sign in before verifying an activity." }, { status: 401 });
    }

    await dbConnect();

    const userInDb = await User.findOne({ email: session.user.email });
    if (!userInDb) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const rawType = formData.get("type");
    const rawLat = formData.get("lat");
    const rawLng = formData.get("lng");
    const image = formData.get("image");

    if (typeof rawType !== "string" || !(rawType in activityMap)) {
      return NextResponse.json({ error: "Invalid activity type." }, { status: 400 });
    }

    if (typeof rawLat !== "string" || typeof rawLng !== "string") {
      return NextResponse.json({ error: "Location is required for verification." }, { status: 400 });
    }

    const lat = Number(rawLat);
    const lng = Number(rawLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "Invalid location provided." }, { status: 400 });
    }

    const type = rawType as ActivityType;
    const isMetro = type === "Metro";
    let auditReason = isMetro
      ? "Metro verification started."
      : "Planting action logged with live location capture.";

    if (isMetro) {
      if (!(image instanceof File) || image.size === 0) {
        return NextResponse.json({ error: "Please upload your metro ticket image first." }, { status: 400 });
      }

      if (image.type && !image.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed for metro verification." }, { status: 400 });
      }
    }

    const activityData = activityMap[type];
    const distanceToStation = getDistanceInKm(lat, lng, NEAREST_METRO.lat, NEAREST_METRO.lng);
    let finalStatus: "approved" | "rejected" = "approved";
    let awardedCredits: number = activityData.credits;
    let awardedCo2: number = activityData.co2;
    let awardedEnergy: number = activityData.energy;
    let extractedStation = "";
    let extractedDate = "";
    const metroTestMode = isMetroTestModeEnabled();

    if (isMetro && image instanceof File) {
      let verificationResult: MetroTicketAIResult;
      console.log("[verifyRoute] Metro verification requested:", {
        fileName: image.name,
        fileType: image.type,
        fileSize: image.size,
      });

      if (metroTestMode) {
        verificationResult = {
          verdict: "VALID_METRO_TICKET",
          isValid: true,
          confidence: 1,
          reason: "Developer test mode approved this upload.",
          stationName: "Test Mode",
          visibleText: image.name,
        };
      } else {
        try {
          verificationResult = await verifyMetroTicketWithAI(image);
          console.log("[verifyRoute] Gemini verification result:", verificationResult);
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : "AI verification is unavailable right now. Please try again.";

          console.error("[verifyRoute] Gemini verification error:", message);

          return NextResponse.json({ error: getVerificationErrorMessage(message) }, { status: 503 });
        }
      }

      auditReason = verificationResult.reason;
      extractedStation = verificationResult.stationName || "";
      extractedDate = verificationResult.visibleText || "";

      if (!verificationResult.isValid || verificationResult.confidence < 0.65) {
        finalStatus = "rejected";
        awardedCredits = 0;
        awardedCo2 = 0;
        awardedEnergy = 0;
        auditReason = getMetroRejectionMessage(verificationResult.verdict);
      }
    }

    const newActivity = await Activity.create({
      userId: userInDb._id,
      title: activityData.title,
      category: activityData.category,
      creditsEarned: awardedCredits,
      co2Offset: awardedCo2,
      energySaved: awardedEnergy,
      status: finalStatus,
      proofImage: image instanceof File && image.size > 0 ? image.name : undefined,
      verificationMetadata: {
        extractedDate,
        extractedStation,
        userLocation: { lat, lng },
        distanceToStation: Number(distanceToStation.toFixed(2)),
        aiAuditReason: auditReason,
      },
    });

    return NextResponse.json({
      success: true,
      activity: newActivity,
      status: finalStatus,
      message:
        finalStatus === "approved"
          ? isMetro
            ? metroTestMode
              ? "Metro test mode approved this upload and issued credits."
              : "Metro ticket verified and credits issued."
            : "Activity verified and credits issued."
          : auditReason || "Invalid metro ticket. Please upload a clear metro ticket image.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Verification failed.";
    console.error("[verifyRoute] Unexpected verification error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
