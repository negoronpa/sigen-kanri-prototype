"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { TouristResource, PersonaSettings } from "@/types";
import { SearchForm } from "@/components/SearchForm";
import { ResourceCard } from "@/components/ResourceCard";
import { SettingsPanel } from "@/components/SettingsPanel";
import { LoginPage } from "@/components/LoginPage";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">地図を読み込み中...</span>
    </div>
  ),
});

const defaultSettings: PersonaSettings = {
  ageGroup: ["middle"],
  travelStyle: ["couple", "family"],
  interests: ["history", "food"],
};

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const [resources, setResources] = useState<TouristResource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [center, setCenter] = useState<[number, number]>([35.6895, 139.6917]); // Default Tokyo
  const [personaSettings, setPersonaSettings] = useState<PersonaSettings>(defaultSettings);

  const handleSearch = async (region: string) => {
    setIsLoading(true);
    setSelectedResourceId(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ region, personaSettings }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze region");
      }

      const data = await response.json();
      setResources(data.resources);

      if (data.resources.length > 0) {
        // Set center to the first resource
        setCenter([data.resources[0].location.lat, data.resources[0].location.lng]);
      }
    } catch (error) {
      console.error("Error searching:", error);
      alert(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const selectedResource =
    resources.find((r) => r.id === selectedResourceId) || null;

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between bg-white z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          🌍 新しい観光資源管理ツール（プロトタイプ）
        </h1>
        <div className="flex items-center gap-4">
          <div className="w-80">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
          <SettingsPanel
            settings={personaSettings}
            onSettingsChange={setPersonaSettings}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={logout}
            title="ログアウト"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Map */}
        <div className="w-2/3 h-full relative border-r">
          <MapView
            resources={resources}
            selectedResourceId={selectedResourceId}
            onSelectResource={setSelectedResourceId}
            center={center}
          />
        </div>

        {/* Right Panel: Details */}
        <div className="w-1/3 h-full bg-slate-50 p-4 overflow-hidden">
          <ResourceCard resource={selectedResource} />
        </div>
      </main>
    </div>
  );
}
