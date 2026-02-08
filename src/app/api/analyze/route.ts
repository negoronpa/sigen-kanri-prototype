import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { TouristResource } from "@/types";

export async function POST(request: Request) {
  try {
    const { region } = await request.json();

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

    const prompt = `
      "${region}" の観光ポテンシャルを分析し、5つの「隠れた観光資源（Hidden Gems）」を特定してください。
      各資源について、欧米圏の観光客（Western）とアジア圏の観光客（Asian）への魅力を別々に評価してください。
      
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
              "asian": 70
            },
            "reasons": {
              "western": "欧米圏への魅力の理由（日本語）",
              "asian": "アジア圏への魅力の理由（日本語）"
            },
            "attributes": {
              "uniqueness": 80, 
              "accessibility": 60,
              "authenticity": 90,
              "storytelling": 75,
              "instagrammability": 70
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
