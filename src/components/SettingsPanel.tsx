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
import { Settings } from "lucide-react";
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
        category: keyof PersonaSettings,
        id: string
    ) => {
        const current = settings[category];
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
