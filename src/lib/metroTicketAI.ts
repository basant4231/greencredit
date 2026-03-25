import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export type MetroTicketVerdict =
  | "VALID_METRO_TICKET"
  | "INVALID_NOT_METRO"
  | "INVALID_UNCLEAR_IMAGE"
  | "INVALID_LOW_CONFIDENCE";

export interface MetroTicketAIResult {
  isValid: boolean;
  confidence: number;
  reason: string;
  verdict: MetroTicketVerdict;
  stationName?: string;
  visibleText?: string;
}

function extractJsonObject(text: string) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed) as MetroTicketAIResult;
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Model did not return JSON.");
    }

    return JSON.parse(match[0]) as MetroTicketAIResult;
  }
}

function invalidResult(reason: string, verdict: MetroTicketVerdict = "INVALID_UNCLEAR_IMAGE"): MetroTicketAIResult {
  return {
    isValid: false,
    confidence: 0,
    reason,
    verdict,
    stationName: "",
    visibleText: "",
  };
}

function normalizeVerdict(value: unknown, isValid: boolean, confidence: number): MetroTicketVerdict {
  if (value === "VALID_METRO_TICKET") {
    return "VALID_METRO_TICKET";
  }

  if (value === "INVALID_NOT_METRO" || value === "INVALID_UNCLEAR_IMAGE" || value === "INVALID_LOW_CONFIDENCE") {
    return value;
  }

  if (isValid && confidence >= 0.65) {
    return "VALID_METRO_TICKET";
  }

  return "INVALID_UNCLEAR_IMAGE";
}

export async function verifyMetroTicketWithAI(image: File): Promise<MetroTicketAIResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const buffer = Buffer.from(await image.arrayBuffer());
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: DEFAULT_GEMINI_MODEL,
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
      maxOutputTokens: 300,
    },
  });

  const prompt = `
You are validating whether an uploaded image is a real metro ticket or metro token proof.

Be strict.
Approve ONLY if the image clearly shows a metro-related ticket, token receipt, QR journey slip, smart-card receipt, or similar metro proof.

Reject if:
- the image is unrelated
- it is a selfie, landscape, room, object, random paper, non-ticket document, or screenshot without clear ticket proof
- it is a bus ticket, railway ticket, airplane ticket, or generic receipt
- the image is too blurry or unreadable to confidently identify as a metro ticket

Return ONLY valid JSON in this exact shape:
{
  "verdict": "VALID_METRO_TICKET" | "INVALID_NOT_METRO" | "INVALID_UNCLEAR_IMAGE" | "INVALID_LOW_CONFIDENCE",
  "isValid": boolean,
  "confidence": number,
  "reason": string,
  "stationName": string,
  "visibleText": string
}

Rules:
- confidence must be between 0 and 1
- verdict must match the decision
- if unsure, set isValid to false
- keep reason under 25 words
- stationName can be empty if not visible
- visibleText should be a short extracted clue, not a long paragraph
- use INVALID_NOT_METRO for objects like keyboard, phone, room, person, food, or unrelated paper
- use INVALID_UNCLEAR_IMAGE for blurry, dark, cropped, or unreadable photos
- use INVALID_LOW_CONFIDENCE when the image may be metro-related but evidence is too weak
`;

  let result;

  try {
    result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: image.type || "image/jpeg",
          data: buffer.toString("base64"),
        },
      },
    ]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gemini verification failed.";

    if (message.includes("API_KEY_INVALID")) {
      throw new Error("Gemini API key is invalid. Please update GEMINI_API_KEY in your .env file and restart the dev server.");
    }

    throw new Error(`Gemini verification failed: ${message}`);
  }

  const rawResponseText = result.response.text();
  console.log("[metroTicketAI] Raw Gemini response:", rawResponseText);

  let parsed: MetroTicketAIResult;

  try {
    parsed = extractJsonObject(rawResponseText);
  } catch {
    return invalidResult("Invalid or unclear metro ticket image.", "INVALID_UNCLEAR_IMAGE");
  }

  console.log("[metroTicketAI] Parsed Gemini response:", parsed);

  const isValid = Boolean(parsed.isValid);
  const confidence =
    typeof parsed.confidence === "number" && Number.isFinite(parsed.confidence)
      ? parsed.confidence
      : 0;

  return {
    isValid,
    confidence,
    reason: typeof parsed.reason === "string" && parsed.reason.trim()
      ? parsed.reason.trim()
      : "Invalid or unclear metro ticket image.",
    verdict: normalizeVerdict(parsed.verdict, isValid, confidence),
    stationName: typeof parsed.stationName === "string" ? parsed.stationName.trim() : "",
    visibleText: typeof parsed.visibleText === "string" ? parsed.visibleText.trim() : "",
  };
}
