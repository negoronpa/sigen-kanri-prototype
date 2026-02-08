"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Sparkles, Globe, BarChart3, Lock } from "lucide-react";

export function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate a brief loading state for UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        const success = login(username, password);
        if (!success) {
            setError("ユーザー名またはパスワードが正しくありません");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 text-white">
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Globe className="h-10 w-10 text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            観光資源管理ツール
                        </h1>
                    </div>

                    <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                        AIが地域の隠れた観光資源を発見し、
                        ターゲット別の価値を可視化する
                        次世代マーケティングプラットフォーム
                    </p>

                    <div className="space-y-4 pt-8">
                        <div className="flex items-center gap-4 text-slate-300">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <MapPin className="h-5 w-5 text-blue-400" />
                            </div>
                            <span>地図上でインタラクティブに資源を可視化</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-300">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Sparkles className="h-5 w-5 text-purple-400" />
                            </div>
                            <span>AIがHidden Gemsを自動発掘</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-300">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-cyan-400" />
                            </div>
                            <span>ペルソナ別の価値をレーダーチャートで分析</span>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-10 left-16 text-slate-500 text-sm">
                    © 2026 Tourist Asset Value Explorer
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4 w-fit">
                            <Lock className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-800">
                            ログイン
                        </CardTitle>
                        <CardDescription className="text-slate-500">
                            認証情報を入力してください
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-slate-700">
                                    ユーザー名
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="ユーザー名を入力"
                                    className="h-11"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700">
                                    パスワード
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="パスワードを入力"
                                    className="h-11"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? "認証中..." : "ログイン"}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t text-center text-sm text-slate-500">
                            本システムは招待制です。<br />
                            アクセス権については管理者にお問い合わせください。
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
