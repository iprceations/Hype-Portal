"use client";

import React, { useEffect, useRef, useState } from "react";
import { useThemeAndLang } from "@/lib/themeContext";

interface ClickPing {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const { resolvedTheme } = useThemeAndLang();
  const isDark = resolvedTheme === "night";

  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isInputMode, setIsInputMode] = useState(false);
  const [pings, setPings] = useState<ClickPing[]>([]);

  // Single unified hardware-accelerated root DOM ref (Locked 1:1 with mouse)
  const cursorRef = useRef<HTMLDivElement | null>(null);

  // Interaction tracking refs to avoid unnecessary re-renders
  const isHoveredRef = useRef(false);
  const isClickingRef = useRef(false);
  const isInputModeRef = useRef(false);

  useEffect(() => {
    // Only activate on desktop pointer devices
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) {
      setIsEnabled(false);
      return;
    }
    setIsEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);

      // Lock cursor container directly to mouse position (100% synchronized, ZERO drift)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = !!target.closest(
          'a, button, [role="button"], select, .cursor-pointer, [data-interactive="true"]'
        );
        const inputField = !!target.closest(
          'input, textarea, select, [contenteditable="true"]'
        );

        if (isHoveredRef.current !== interactive) {
          isHoveredRef.current = interactive;
          setIsHovered(interactive);
        }
        if (isInputModeRef.current !== inputField) {
          isInputModeRef.current = inputField;
          setIsInputMode(inputField);
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isClickingRef.current = true;
      setIsClicking(true);

      const pingId = Date.now();
      setPings((prev) => [...prev.slice(-2), { id: pingId, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setPings((prev) => prev.filter((p) => p.id !== pingId));
      }, 400);
    };

    const handleMouseUp = () => {
      isClickingRef.current = false;
      setIsClicking(false);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <>
      {/* Click Micro-Animation Shockwaves (Rendered at exact click origin) */}
      {pings.map((ping) => (
        <React.Fragment key={ping.id}>
          {/* Expanding glowing primary ring */}
          <div
            className="fixed pointer-events-none rounded-full border-2 border-[#F97316] z-[999998] cursor-click-ripple"
            style={{
              left: ping.x,
              top: ping.y,
              width: "32px",
              height: "32px",
            }}
          />
          {/* Expanding soft secondary ring with slight delay */}
          <div
            className="fixed pointer-events-none rounded-full border border-[#F59E0B] z-[999998] cursor-click-ripple"
            style={{
              left: ping.x,
              top: ping.y,
              width: "22px",
              height: "22px",
              animationDelay: "45ms",
            }}
          />
          {/* Micro-spark center flash */}
          <div
            className="fixed pointer-events-none rounded-full bg-[#FFFFFF] z-[999998] cursor-click-flash shadow-[0_0_8px_#F97316]"
            style={{
              left: ping.x,
              top: ping.y,
              width: "6px",
              height: "6px",
            }}
          />
        </React.Fragment>
      ))}

      {/* Unified Cursor Container: Clean arrow pointer permanently */}
      <div
        ref={cursorRef}
        className={`pointer-events-none fixed top-0 left-0 z-[999999] will-change-transform transition-opacity duration-150 ${
          isVisible && !isInputMode ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
        aria-hidden="true"
      >
        <div className="relative -top-1 -left-1">
          {/* Custom High-Precision Faceted Cyber Arrow (Always clean arrow with tactile click animation) */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={`relative z-20 transition-transform duration-100 origin-top-left ${
              isClicking
                ? "scale-[0.80] translate-x-0.5 translate-y-0.5"
                : isHovered
                ? "scale-[1.12]"
                : "scale-100"
            }`}
            style={{
              filter: isDark
                ? "drop-shadow(0 2px 6px rgba(249,115,22,0.5)) drop-shadow(0 1px 2px rgba(0,0,0,0.85))"
                : "drop-shadow(0 2px 4px rgba(234,88,12,0.4)) drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
            }}
          >
            {/* Outer stroke / contour */}
            <path
              d="M3 2L19 11L11.5 13.5L8.5 21L3 2Z"
              fill="#0F172A"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Left aerodynamic facet (#F97316 Brilliant Orange) */}
            <path
              d="M3 2L11.5 13.5L8.5 21L3 2Z"
              fill="#F97316"
            />
            {/* Center crisp separator ridge */}
            <path
              d="M3 2L11.5 13.5"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
