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
            A: resource.attributes.uniqueness,
            fullMark: 100,
        },
        {
            subject: "アクセス",
            A: resource.attributes.accessibility,
            fullMark: 100,
        },
        {
            subject: "本物感",
            A: resource.attributes.authenticity,
            fullMark: 100,
        },
        {
            subject: "物語性",
            A: resource.attributes.storytelling,
            fullMark: 100,
        },
        {
            subject: "映え度",
            A: resource.attributes.instagrammability,
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
                                name="評価値"
                                dataKey="A"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                            />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-50 p-2 rounded">
                        <span className="font-bold block text-blue-700">欧米圏: {resource.scores.western}</span>
                        <p className="text-gray-600 mt-1">{resource.reasons.western}</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                        <span className="font-bold block text-red-700">アジア圏: {resource.scores.asian}</span>
                        <p className="text-gray-600 mt-1">{resource.reasons.asian}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
