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
        <Card className="h-full overflow-y-auto">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            {resource.name}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base">
                            {resource.description}
                        </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            欧米圏: {resource.scores.western}
                        </Badge>
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                            アジア圏: {resource.scores.asian}
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            日本人: {resource.scores.japanese}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <ResourceRadarChart resource={resource} />

                <div className="space-y-2">
                    <h3 className="font-semibold">分析結果</h3>
                    <div className="grid gap-4 md:grid-cols-1">
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">欧米圏への魅力</p>
                            <p className="text-sm text-muted-foreground">{resource.reasons.western}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">アジア圏への魅力</p>
                            <p className="text-sm text-muted-foreground">{resource.reasons.asian}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">日本人への魅力</p>
                            <p className="text-sm text-muted-foreground">{resource.reasons.japanese}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
