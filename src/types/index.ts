export interface CulturalScore {
  western: number;
  asian: number;
  japanese: number;
}

export interface CulturalReason {
  western: string;
  asian: string;
  japanese: string;
}

export interface BaseAttributes {
  uniqueness: number; // 非代替性
  accessibility: number; // アクセス性
  authenticity: number; // 本物感
  storytelling: number; // 物語性
  instagrammability: number; // 映え度
  matrix: {
    x: number; // 同質(-50) ↔ 異質(50)
    y: number; // 一般的(-50) ↔ 非代替的(50)
    reason: string; // なぜそのポジションになったかの詳細な理由
  };
}

export interface ResourceAttributes {
  western: BaseAttributes;
  asian: BaseAttributes;
  japanese: BaseAttributes;
}

export interface TouristResource {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  scores: CulturalScore;
  reasons: CulturalReason;
  attributes: ResourceAttributes;
}

export interface AnalysisResponse {
  resources: TouristResource[];
}

export interface PersonaSettings {
  ageGroup: string[];
  travelStyle: string[];
  interests: string[];
}

export const AGE_GROUPS = [
  { id: "young", label: "〜20代" },
  { id: "middle", label: "30〜40代" },
  { id: "senior", label: "50〜60代" },
  { id: "elderly", label: "70代〜" },
];

export const TRAVEL_STYLES = [
  { id: "solo", label: "一人旅" },
  { id: "couple", label: "カップル" },
  { id: "family", label: "家族連れ" },
  { id: "friends", label: "友人グループ" },
  { id: "business", label: "ビジネス" },
];

export const INTERESTS = [
  { id: "nature", label: "自然・アウトドア" },
  { id: "history", label: "歴史・文化" },
  { id: "food", label: "食・グルメ" },
  { id: "experience", label: "体験型アクティビティ" },
  { id: "entertainment", label: "エンタメ・ショッピング" },
  { id: "relaxation", label: "リラックス・癒し" },
];
