"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TouristResource } from "@/types";

interface RadarChartProps {
    resource: TouristResource;
}

export function ResourceRadarChart({ resource }: RadarChartProps) {
    const data = [
        {
            subject: "非代替性",
            Western: resource.attributes.western.uniqueness,
            Asian: resource.attributes.asian.uniqueness,
            Japanese: resource.attributes.japanese.uniqueness,
            fullMark: 100,
        },
        {
            subject: "アクセス",
            Western: resource.attributes.western.accessibility,
            Asian: resource.attributes.asian.accessibility,
            Japanese: resource.attributes.japanese.accessibility,
            fullMark: 100,
        },
        {
            subject: "本物感",
            Western: resource.attributes.western.authenticity,
            Asian: resource.attributes.asian.authenticity,
            Japanese: resource.attributes.japanese.authenticity,
            fullMark: 100,
        },
        {
            subject: "物語性",
            Western: resource.attributes.western.storytelling,
            Asian: resource.attributes.asian.storytelling,
            Japanese: resource.attributes.japanese.storytelling,
            fullMark: 100,
        },
        {
            subject: "映え度",
            Western: resource.attributes.western.instagrammability,
            Asian: resource.attributes.asian.instagrammability,
            Japanese: resource.attributes.japanese.instagrammability,
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
                <div className="h-[200px] w-full">
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
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-blue-50 p-2 rounded">
                        <span className="font-bold block text-blue-700">欧米圏: {resource.scores.western}</span>
                        <p className="text-gray-600 mt-1">{resource.reasons.western}</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                        <span className="font-bold block text-red-700">アジア圏: {resource.scores.asian}</span>
                        <p className="text-gray-600 mt-1">{resource.reasons.asian}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                        <span className="font-bold block text-green-700">日本人: {resource.scores.japanese}</span>
                        <p className="text-gray-600 mt-1">{resource.reasons.japanese}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
