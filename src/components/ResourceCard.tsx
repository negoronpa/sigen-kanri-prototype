"use client";

import { TouristResource } from "@/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResourceRadarChart } from "./RadarChart";
import { MapPin } from "lucide-react";

interface ResourceCardProps {
    resource: TouristResource | null;
}

export function ResourceCard({ resource }: ResourceCardProps) {
    if (!resource) {
        return (
            <Card className="h-full flex items-center justify-center p-6 text-muted-foreground">
                地図上のマーカーを選択して詳細を表示してください
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            {resource.name}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base">
                            {resource.description}
                        </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 whitespace-nowrap">
                            欧米圏: {resource.scores?.western ?? 0}
                        </Badge>
                        <Badge variant="secondary" className="bg-red-100 text-red-800 whitespace-nowrap">
                            アジア圏: {resource.scores?.asian ?? 0}
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 whitespace-nowrap">
                            日本人: {resource.scores?.japanese ?? 0}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
                <ResourceRadarChart resource={resource} />
            </CardContent>
        </Card>
    );
}
