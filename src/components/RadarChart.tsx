"use client";

import { useState, useEffect } from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TouristResource, BaseAttributes } from "@/types";

import { ValueMatrix } from "./ValueMatrix";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

interface RadarChartProps {
    resource: TouristResource;
}

const defaultAttributes: BaseAttributes = {
    uniqueness: 0,
    accessibility: 0,
    authenticity: 0,
    storytelling: 0,
    instagrammability: 0,
    matrix: { x: 0, y: 0, reason: "" },
};

export function ResourceRadarChart({ resource }: RadarChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Safely access nested attributes with defaults
    const westernAttributes = resource.attributes?.western || defaultAttributes;
    const asianAttributes = resource.attributes?.asian || defaultAttributes;
    const japaneseAttributes = resource.attributes?.japanese || defaultAttributes;

    const data = [
        {
            subject: "非代替性",
            Western: westernAttributes.uniqueness || 0,
            Asian: asianAttributes.uniqueness || 0,
            Japanese: japaneseAttributes.uniqueness || 0,
            fullMark: 100,
        },
        {
            subject: "アクセス",
            Western: westernAttributes.accessibility || 0,
            Asian: asianAttributes.accessibility || 0,
            Japanese: japaneseAttributes.accessibility || 0,
            fullMark: 100,
        },
        {
            subject: "本物感",
            Western: westernAttributes.authenticity || 0,
            Asian: asianAttributes.authenticity || 0,
            Japanese: japaneseAttributes.authenticity || 0,
            fullMark: 100,
        },
        {
            subject: "物語性",
            Western: westernAttributes.storytelling || 0,
            Asian: asianAttributes.storytelling || 0,
            Japanese: japaneseAttributes.storytelling || 0,
            fullMark: 100,
        },
        {
            subject: "映え度",
            Western: westernAttributes.instagrammability || 0,
            Asian: asianAttributes.instagrammability || 0,
            Japanese: japaneseAttributes.instagrammability || 0,
            fullMark: 100,
        },
    ];

    return (
        <Card className="w-full">
            <CardHeader className="py-2.5">
                <CardTitle className="text-sm font-bold text-center text-slate-500 uppercase tracking-widest">
                    価値分析レーダーチャート
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
                <div className="h-[200px] w-full flex items-center justify-center">
                    {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="42%" outerRadius="65%" data={data}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                                <Radar
                                    name="欧米人"
                                    dataKey="Western"
                                    stroke="#2563eb"
                                    fill="#2563eb"
                                    fillOpacity={0.3}
                                />
                                <Radar
                                    name="アジア人"
                                    dataKey="Asian"
                                    stroke="#dc2626"
                                    fill="#dc2626"
                                    fillOpacity={0.3}
                                />
                                <Radar
                                    name="日本人"
                                    dataKey="Japanese"
                                    stroke="#16a34a"
                                    fill="#16a34a"
                                    fillOpacity={0.3}
                                />
                                <Legend wrapperStyle={{ paddingTop: "25px", fontSize: "11px", fontWeight: "bold" }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-muted-foreground text-xs italic">チャートを読み込み中...</div>
                    )}
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 text-xs">
                    {/* Western */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold block text-blue-700">欧米人: {resource.scores?.western ?? 0}</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white rounded-full text-[10px] hover:bg-blue-700 transition-colors shadow-sm">
                                        <Info className="w-3 h-3" />
                                        ポイント
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 border-none shadow-2xl" side="right" align="start">
                                    <ValueMatrix
                                        x={westernAttributes.matrix?.x ?? 0}
                                        y={westernAttributes.matrix?.y ?? 0}
                                        reason={westernAttributes.matrix?.reason ?? ""}
                                        targetName="欧米人"
                                        color="blue"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{resource.reasons?.western ?? "-"}</p>
                    </div>

                    {/* Asian */}
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold block text-red-700">アジア人: {resource.scores?.asian ?? 0}</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white rounded-full text-[10px] hover:bg-red-700 transition-colors shadow-sm">
                                        <Info className="w-3 h-3" />
                                        ポイント
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 border-none shadow-2xl" side="right" align="start">
                                    <ValueMatrix
                                        x={asianAttributes.matrix?.x ?? 0}
                                        y={asianAttributes.matrix?.y ?? 0}
                                        reason={asianAttributes.matrix?.reason ?? ""}
                                        targetName="アジア人"
                                        color="red"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{resource.reasons?.asian ?? "-"}</p>
                    </div>

                    {/* Japanese */}
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold block text-green-700">日本人: {resource.scores?.japanese ?? 0}</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white rounded-full text-[10px] hover:bg-green-700 transition-colors shadow-sm">
                                        <Info className="w-3 h-3" />
                                        ポイント
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 border-none shadow-2xl" side="right" align="start">
                                    <ValueMatrix
                                        x={japaneseAttributes.matrix?.x ?? 0}
                                        y={japaneseAttributes.matrix?.y ?? 0}
                                        reason={japaneseAttributes.matrix?.reason ?? ""}
                                        targetName="日本人"
                                        color="green"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{resource.reasons?.japanese ?? "-"}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
