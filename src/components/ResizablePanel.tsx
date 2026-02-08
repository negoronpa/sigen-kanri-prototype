"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface ResizablePanelProps {
    leftPanel: React.ReactNode;
    rightPanel: React.ReactNode;
    defaultLeftWidth?: number; // percentage
    minLeftWidth?: number; // percentage
    maxLeftWidth?: number; // percentage
}

export function ResizablePanel({
    leftPanel,
    rightPanel,
    defaultLeftWidth = 65,
    minLeftWidth = 40,
    maxLeftWidth = 80,
}: ResizablePanelProps) {
    const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMouseDown = useCallback(() => {
        isDragging.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    }, []);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging.current || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

            if (newLeftWidth >= minLeftWidth && newLeftWidth <= maxLeftWidth) {
                setLeftWidth(newLeftWidth);
            }
        },
        [minLeftWidth, maxLeftWidth]
    );

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    }, []);

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return (
        <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
            {/* Left Panel */}
            <div
                className="h-full relative overflow-hidden"
                style={{ width: `${leftWidth}%` }}
            >
                {leftPanel}
            </div>

            {/* Resizer Handle */}
            <div
                className="w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors flex-shrink-0 relative group"
                onMouseDown={handleMouseDown}
            >
                <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-blue-400/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded group-hover:bg-blue-500" />
            </div>

            {/* Right Panel */}
            <div
                className="h-full bg-slate-50 overflow-hidden"
                style={{ width: `${100 - leftWidth}%` }}
            >
                {rightPanel}
            </div>
        </div>
    );
}
