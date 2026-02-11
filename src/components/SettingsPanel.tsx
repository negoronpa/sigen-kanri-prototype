"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, UserPlus } from "lucide-react";
import {
    PersonaSettings,
    AGE_GROUPS,
    TRAVEL_STYLES,
    INTERESTS,
} from "@/types";

interface SettingsPanelProps {
    settings: PersonaSettings;
    onSettingsChange: (settings: PersonaSettings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
    const [open, setOpen] = useState(false);

    const toggleOption = (
        category: "ageGroup" | "travelStyle" | "interests",
        id: string
    ) => {
        const current = settings[category] as string[];
        const updated = current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id];
        onSettingsChange({ ...settings, [category]: updated });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>ペルソナ設定</DialogTitle>
                    <DialogDescription>
                        分析対象のペルソナを設定します。選択した条件に基づいてAIが観光資源を評価します。
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* Age Group */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm">年齢層</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {AGE_GROUPS.map((item) => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`age-${item.id}`}
                                        checked={settings.ageGroup.includes(item.id)}
                                        onCheckedChange={() => toggleOption("ageGroup", item.id)}
                                    />
                                    <Label htmlFor={`age-${item.id}`} className="text-sm">
                                        {item.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Travel Style */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm">旅行形態</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {TRAVEL_STYLES.map((item) => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`travel-${item.id}`}
                                        checked={settings.travelStyle.includes(item.id)}
                                        onCheckedChange={() => toggleOption("travelStyle", item.id)}
                                    />
                                    <Label htmlFor={`travel-${item.id}`} className="text-sm">
                                        {item.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interests */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm">興味関心</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {INTERESTS.map((item) => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`interest-${item.id}`}
                                        checked={settings.interests.includes(item.id)}
                                        onCheckedChange={() => toggleOption("interests", item.id)}
                                    />
                                    <Label htmlFor={`interest-${item.id}`} className="text-sm">
                                        {item.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom Persona */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-blue-600" />
                            <h4 className="font-medium text-sm">詳細なペルソナ設定 (カスタム)</h4>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
                                特定の国籍、職業、具体的な趣味嗜好などを詳しく入力してください。
                                この内容は既存の3軸とは別の独立した「カスタム」視点として分析されます。
                            </p>
                            <Textarea
                                placeholder="例: 30代、フランス出身、日本の伝統工芸を愛好しており、特に酒蔵巡り...（中略）...本物の体験を重視する一人旅。"
                                className="min-h-[120px] text-sm leading-relaxed resize-none focus-visible:border-blue-300 focus-visible:ring-blue-100"
                                value={settings.customPersona}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onSettingsChange({ ...settings, customPersona: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
