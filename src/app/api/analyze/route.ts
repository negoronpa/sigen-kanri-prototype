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
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const personaCondition = personaSettings
      ? buildPersonaDescription(personaSettings)
      : "";

    const customPersonaPrompt = personaSettings?.customPersona
      ? `4. カスタムペルソナ（Custom）：${personaSettings.customPersona}`
      : "";

    const prompt = `
      "${region}" の観光ポテンシャルを分析し、5つの「隠れた観光資源（Hidden Gems）」を特定してください。
      
      【重要】スコアリングの指針：
      1. 各ターゲット層（欧米・アジア・日本${personaSettings?.customPersona ? '・カスタム' : ''}）の文化的背景、旅行習慣、価値観の違いを鋭く反映させ、スコアに大きな差をつけてください。
      2. 0点から100点の全範囲を使い、平均的な点数（70-80点代）に偏らないようにしてください。
      3. ある層には高評価（90点以上）でも、別の層には全く響かない（40点以下）といった、ドラスティックな評価を求めています。
      4. 特に「本物感（Authenticity）」や「物語性（Storytelling）」は、そのターゲットの視点から厳しく評価してください。

      ターゲット層：
      1. 欧米圏の観光客（Western）：歴史的背景、本物志向、アドベンチャーを重視
      2. アジア圏の観光客（Asian）：トレンド、映え、ショッピング、食、利便性を重視
      3. 日本人の観光客（Japanese）：四季、癒し、質の高いサービス、定番からの脱却を重視
      ${customPersonaPrompt}
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
              "western": 95,
              "asian": 40,
              "japanese": 65${personaSettings?.customPersona ? ',\n              "custom": 85' : ''}
            },
            "reasons": {
              "western": "欧米圏への魅力の理由",
              "asian": "アジア圏への魅力の理由",
              "japanese": "日本人への魅力の理由"${personaSettings?.customPersona ? ',\n              "custom": "カスタムペルソナへの魅力の理由"' : ''}
            },
            "attributes": {
              "western": {
                "uniqueness": 90, 
                "accessibility": 40,
                "authenticity": 95,
                "storytelling": 90,
                "instagrammability": 50,
                "matrix": { 
                  "x": 40, 
                  "y": 45,
                  "reason": "..."
                }
              },
              "asian": { ... },
              "japanese": { ... }${personaSettings?.customPersona ? ',\n              "custom": {\n                "uniqueness": 80, \n                "accessibility": 60,\n                "authenticity": 85,\n                "storytelling": 80,\n                "instagrammability": 70,\n                "matrix": { \n                  "x": 20, \n                  "y": 30,\n                  "reason": "..." \n                }\n              }' : ''}
            }
          }
        ]
      }
      
      【重要】matrixデータの定義：
      x軸（横軸）: -50（同質/Homogeneous）から 50（異質/Heterogeneous）の数値。そのターゲットの日常や既知の文化とどれだけ「違う」か。
      y軸（縦軸）: -50（一般的/General）から 50（非代替的/Unique）の数値。そのターゲットにとって「他では替えが効かない」かどうか。
      reason: その座標にプロットした理由を、ターゲットの文化的背景を踏まえて簡潔に（2-3文で）記述してください。
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to extract valid JSON
    let cleanText = text.trim();

    // Try to find JSON object in the text
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }

    // Fix common JSON issues (trailing commas)
    cleanText = cleanText.replace(/,(\s*[}\]])/g, "$1");

    try {
      const data = JSON.parse(cleanText);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", text);
      console.error("Cleaned response:", cleanText);
      return NextResponse.json(
        { error: "AIの応答を解析できませんでした。もう一度お試しください。" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error analyzing region:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze region" },
      { status: 500 }
    );
  }
}
