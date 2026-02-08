export interface CulturalScore {
  western: number;
  asian: number;
}

export interface CulturalReason {
  western: string;
  asian: string;
}

export interface ResourceAttributes {
  uniqueness: number; // 非代替性
  accessibility: number; // アクセス性
  authenticity: number; // 本物感
  storytelling: number; // 物語性
  instagrammability: number; // 映え度
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
