import { useState, useEffect } from "react";
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
import { MapPin, Image as ImageIcon, Loader2 } from "lucide-react";

interface ResourceCardProps {
    resource: TouristResource | null;
}

export function ResourceCard({ resource }: ResourceCardProps) {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

    useEffect(() => {
        if (resource) {
            setIsLoadingPhoto(true);
            setPhotoUrl(null);

            const fetchPhoto = async () => {
                try {
                    const res = await fetch(`/api/photos?name=${encodeURIComponent(resource.name)}&lat=${resource.location.lat}&lng=${resource.location.lng}`);
                    const data = await res.json();
                    setPhotoUrl(data.photoUrl);
                } catch (error) {
                    console.error("Error fetching photo:", error);
                } finally {
                    setIsLoadingPhoto(false);
                }
            };

            fetchPhoto();
        }
    }, [resource]);

    if (!resource) {
        return (
            <Card className="h-full flex items-center justify-center p-6 text-muted-foreground border-slate-200 shadow-sm bg-slate-50/50">
                <div className="flex flex-col items-center gap-2">
                    <MapPin className="h-8 w-8 opacity-20" />
                    <p>地図上のマーカーを選択して詳細表示</p>
                </div>
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

                        {/* Photo Section */}
                        <div className="mt-4 relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            {isLoadingPhoto ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                </div>
                            ) : photoUrl ? (
                                <img
                                    src={photoUrl}
                                    alt={resource.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                                    <ImageIcon className="h-8 w-8 opacity-20" />
                                    <span className="text-xs italic">写真は見つかりませんでした</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 whitespace-nowrap px-3 py-1 shadow-sm border-blue-200">
                            欧米圏: {resource.scores?.western ?? 0}
                        </Badge>
                        <Badge variant="secondary" className="bg-red-100 text-red-800 whitespace-nowrap px-3 py-1 shadow-sm border-red-200">
                            アジア圏: {resource.scores?.asian ?? 0}
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 whitespace-nowrap px-3 py-1 shadow-sm border-green-200">
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
