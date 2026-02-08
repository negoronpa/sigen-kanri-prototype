"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface SearchFormProps {
    onSearch: (region: string) => Promise<void>;
    isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [region, setRegion] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (region.trim()) {
            onSearch(region);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
            <Input
                placeholder="地域名を入力 (例: 京都、鎌倉)"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="flex-1"
                disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !region.trim()}>
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                    <Search className="h-4 w-4 mr-2" />
                )}
                分析する
            </Button>
        </form>
    );
}
