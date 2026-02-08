import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { PersonaSettings, AGE_GROUPS, TRAVEL_STYLES, INTERESTS } from "@/types";

function buildPersonaDescription(settings: PersonaSettings): string {
  const ageLabels = settings.ageGroup
    .map((id) => AGE_GROUPS.find((a) => a.id === id)?.label)
    .filter(Boolean)
    .join("、");

  const travelLabels = settings.travelStyle
    .map((id) => TRAVEL_STYLES.find((t) => t.id === id)?.label)
    .filter(Boolean)
    .join("、");

  const interestLabels = settings.interests
    .map((id) => INTERESTS.find((i) => i.id === id)?.label)
    .filter(Boolean)
    .join("、");

  const parts: string[] = [];
  if (ageLabels) parts.push(`年齢層: ${ageLabels}`);
  if (travelLabels) parts.push(`旅行形態: ${travelLabels}`);
  if (interestLabels) parts.push(`興味関心: ${interestLabels}`);

  return parts.length > 0
    ? `\n\n特に以下の条件を持つ観光客を想定して評価してください：\n${parts.join("\n")}`
    : "";
}

export async function POST(request: Request) {
  try {
    const { region, personaSettings } = await request.json();

    if (!region) {
      return NextResponse.json(
        { error: "Region is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const personaCondition = personaSettings
      ? buildPersonaDescription(personaSettings)
      : "";

    const prompt = `
      "${region}" の観光ポテンシャルを分析し、5つの「隠れた観光資源（Hidden Gems）」を特定してください。
      各資源について、以下の3つのターゲット層への魅力を別々に評価してください：
      1. 欧米圏の観光客（Western）
      2. アジア圏の観光客（Asian）
      3. 日本人の観光客（Japanese）
      ${personaCondition}
      
      出力は以下のJSON形式のみで行い、言語はすべて日本語で記述してください：
      {
        "resources": [
          {
            "id": "unique_id",
            "name": "資源名",
            "description": "簡潔な説明（日本語）",
            "location": {
              "lat": 35.000,
              "lng": 135.000
            },
            "scores": {
              "western": 85,
              "asian": 70,
              "japanese": 90
            },
            "reasons": {
              "western": "欧米圏への魅力の理由",
              "asian": "アジア圏への魅力の理由",
              "japanese": "日本人への魅力の理由"
            },
            "attributes": {
              "western": {
                "uniqueness": 80, 
                "accessibility": 60,
                "authenticity": 90,
                "storytelling": 75,
                "instagrammability": 70
              },
              "asian": {
                "uniqueness": 70, 
                "accessibility": 80,
                "authenticity": 70,
                "storytelling": 80,
                "instagrammability": 90
              },
              "japanese": {
                "uniqueness": 60, 
                "accessibility": 90,
                "authenticity": 80,
                "storytelling": 90,
                "instagrammability": 60
              }
            }
          }
        ]
      }
      JSON以外のテキストは含めないでください。
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(cleanText);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error analyzing region:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze region" },
      { status: 500 }
    );
  }
}
