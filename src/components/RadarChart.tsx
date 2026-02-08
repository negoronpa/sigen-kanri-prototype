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

interface RadarChartProps {
    resource: TouristResource;
}

const defaultAttributes: BaseAttributes = {
    uniqueness: 0,
    accessibility: 0,
    authenticity: 0,
    storytelling: 0,
    instagrammability: 0,
};

export function ResourceRadarChart({ resource }: RadarChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Safely access nested attributes with defaults
    const western = resource.attributes?.western || defaultAttributes;
    const asian = resource.attributes?.asian || defaultAttributes;
    const japanese = resource.attributes?.japanese || defaultAttributes;

    const data = [
        {
            subject: "非代替性",
            Western: western.uniqueness || 0,
            Asian: asian.uniqueness || 0,
            Japanese: japanese.uniqueness || 0,
            fullMark: 100,
        },
        {
            subject: "アクセス",
            Western: western.accessibility || 0,
            Asian: asian.accessibility || 0,
            Japanese: japanese.accessibility || 0,
            fullMark: 100,
        },
        {
            subject: "本物感",
            Western: western.authenticity || 0,
            Asian: asian.authenticity || 0,
            Japanese: japanese.authenticity || 0,
            fullMark: 100,
        },
        {
            subject: "物語性",
            Western: western.storytelling || 0,
            Asian: asian.storytelling || 0,
            Japanese: japanese.storytelling || 0,
            fullMark: 100,
        },
        {
            subject: "映え度",
            Western: western.instagrammability || 0,
            Asian: asian.instagrammability || 0,
            Japanese: japanese.instagrammability || 0,
            fullMark: 100,
        },
    ];

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-center">
                    価値分析チャート
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full flex items-center justify-center">
                    {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                                <Radar
                                    name="欧米圏"
                                    dataKey="Western"
                                    stroke="#2563eb"
                                    fill="#2563eb"
                                    fillOpacity={0.3}
                                />
                                <Radar
                                    name="アジア圏"
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
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-muted-foreground text-xs italic">チャートを読み込み中...</div>
                    )}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-blue-50 p-2 rounded">
                        <span className="font-bold block text-blue-700">欧米圏: {resource.scores?.western ?? 0}</span>
                        <p className="text-gray-600 mt-1 line-clamp-2" title={resource.reasons?.western}>{resource.reasons?.western ?? "-"}</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                        <span className="font-bold block text-red-700">アジア圏: {resource.scores?.asian ?? 0}</span>
                        <p className="text-gray-600 mt-1 line-clamp-2" title={resource.reasons?.asian}>{resource.reasons?.asian ?? "-"}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                        <span className="font-bold block text-green-700">日本人: {resource.scores?.japanese ?? 0}</span>
                        <p className="text-gray-600 mt-1 line-clamp-2" title={resource.reasons?.japanese}>{resource.reasons?.japanese ?? "-"}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
