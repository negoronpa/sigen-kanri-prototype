"use client";

import React from "react";

interface ValueMatrixProps {
    x: number; // -50 to 50
    y: number; // -50 to 50
    reason: string;
    targetName: string;
    color?: "blue" | "red" | "green" | "purple";
}

export function ValueMatrix({ x, y, reason, targetName, color = "blue" }: ValueMatrixProps) {
    // Color mapping for Tailwind classes
    const colorClasses = {
        blue: {
            dot: "bg-blue-500",
            point: "bg-blue-600",
            ping: "bg-blue-500/40",
            pulse: "bg-blue-600/20",
            ring: "ring-blue-600/40",
            border: "border-blue-100/50",
            bg: "bg-blue-50/40",
            text: "text-blue-700",
            indicator: "bg-blue-500"
        },
        red: {
            dot: "bg-red-500",
            point: "bg-red-600",
            ping: "bg-red-500/40",
            pulse: "bg-red-600/20",
            ring: "ring-red-600/40",
            border: "border-red-100/50",
            bg: "bg-red-50/40",
            text: "text-red-700",
            indicator: "bg-red-500"
        },
        green: {
            dot: "bg-green-500",
            point: "bg-green-600",
            ping: "bg-green-500/40",
            pulse: "bg-green-600/20",
            ring: "ring-green-600/40",
            border: "border-green-100/50",
            bg: "bg-green-50/40",
            text: "text-green-700",
            indicator: "bg-green-500"
        },
        purple: {
            dot: "bg-purple-500",
            point: "bg-purple-600",
            ping: "bg-purple-500/40",
            pulse: "bg-purple-600/20",
            ring: "ring-purple-600/40",
            border: "border-purple-100/50",
            bg: "bg-purple-50/40",
            text: "text-purple-700",
            indicator: "bg-purple-500"
        }
    }[color];

    // Clamp values to ensure they stay within -50 to 50 range
    const clampedX = Math.max(-50, Math.min(50, x));
    const clampedY = Math.max(-50, Math.min(50, y));

    // Map -50..50 to 4%..96% (adding 4% margin to prevent clipping at edges)
    const posX = ((clampedX + 50) / 100) * 92 + 4;
    const posY = 100 - (((clampedY + 50) / 100) * 92 + 4); // Invert Y and apply margin

    return (
        <div className="flex flex-col gap-4 p-5 w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-300 text-left">
            <div className="text-base font-bold text-slate-900 text-center flex items-center justify-center gap-2 border-b border-slate-100 pb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${colorClasses.dot} animate-pulse`} />
                {targetName}の価値マトリクス分析
            </div>

            <div className="relative w-full aspect-square border-2 border-slate-300 bg-slate-50/30 rounded-xl overflow-hidden shadow-inner">
                {/* Axes */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-400/50 border-dashed border-l" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-400/50 border-dashed border-t" />

                {/* Quadrant Labels */}
                <div className="absolute top-2 left-2 text-[9px] text-slate-400 font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                    非代替的×同質
                </div>
                <div className="absolute top-2 right-2 text-[9px] text-slate-400 font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-sm text-right">
                    非代替的×異質
                </div>
                <div className="absolute bottom-2 left-2 text-[9px] text-slate-400 font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                    一般的×同質
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] text-slate-400 font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-sm text-right">
                    一般的×異質
                </div>

                {/* Axis Labels */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white/50 px-1 rounded">
                    非代替的
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white/50 px-1 rounded">
                    一般的
                </div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 vertical-rl uppercase tracking-widest bg-white/50 py-1 rounded">
                    同質
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 vertical-rl uppercase tracking-widest bg-white/50 py-1 rounded">
                    異質
                </div>

                {/* The Point (Dynamic Color) */}
                <div
                    className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out z-20"
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                >
                    <div className={`absolute inset-0 ${colorClasses.ping} rounded-full animate-ping`} />
                    <div className={`absolute inset-0 ${colorClasses.pulse} rounded-full animate-pulse scale-150`} />
                    <div className={`absolute inset-1.5 ${colorClasses.point} rounded-full border-2 border-white shadow-lg ring-2 ${colorClasses.ring}`} />
                </div>
            </div>

            {/* Analysis Reason Section */}
            <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <div className={`w-1.5 h-4 ${colorClasses.indicator} rounded-full`} />
                    分析の根拠
                </div>
                <div className={`text-[13px] text-slate-700 leading-relaxed ${colorClasses.bg} p-3.5 rounded-xl border ${colorClasses.border} shadow-sm min-h-[60px]`}>
                    {reason || "分析データがありません。再度分析を実行してください。"}
                </div>
            </div>

            <div className="text-[10px] text-slate-400 leading-tight pt-2 border-t border-slate-100 italic text-center text-slate-400">
                ※ 縦軸：希少性の高さ / 横軸：文化背景の差異
            </div>
        </div>
    );
}
