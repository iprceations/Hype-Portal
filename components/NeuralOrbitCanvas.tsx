"use client";

import React, { useRef, useEffect } from "react";
import { useThemeAndLang } from "@/lib/themeContext";

interface NeuralOrbitCanvasProps {
  className?: string;
  isBackground?: boolean;
}

export default function NeuralOrbitCanvas({
  className = "",
  isBackground = true,
}: NeuralOrbitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useThemeAndLang();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      width = canvas.width = parent?.clientWidth || window.innerWidth;
      height = canvas.height = parent?.clientHeight || 500;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Mouse tracking for subtle parallax deflection
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Master UI/UX Orbital satellites with theme-adapted colors
    const orbits = [
      {
        radius: 65,
        speed: 0.016,
        angle: 0.2,
        size: 4,
        label: "matrix-01",
        colorLight: "#F97316",
        colorDark: "#F97316",
      },
      {
        radius: 115,
        speed: -0.011,
        angle: 1.4,
        size: 4.5,
        label: "neural-2",
        colorLight: "#D97706",
        colorDark: "#F59E0B",
      },
      {
        radius: 175,
        speed: 0.0085,
        angle: 2.7,
        size: 5,
        label: "radar-node",
        colorLight: "#0F172A",
        colorDark: "#38BDF8",
      },
      {
        radius: 240,
        speed: -0.0055,
        angle: 4.2,
        size: 4.2,
        label: "core-stream",
        colorLight: "#EA580C",
        colorDark: "#F97316",
      },
      {
        radius: 310,
        speed: 0.004,
        angle: 0.9,
        size: 5.5,
        label: "signal-mesh",
        colorLight: "#D97706",
        colorDark: "#F59E0B",
      },
      {
        radius: 390,
        speed: -0.0028,
        angle: 3.5,
        size: 4.5,
        label: "telemetry",
        colorLight: "#334155",
        colorDark: "#CBD5E1",
      },
    ];

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Check current theme dynamically every frame
      const isDark =
        resolvedTheme === "night" ||
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";

      // Position center of radar: on desktop in background mode, center towards the right (70% width)
      // so the radar circles blossom in the open area and ripple behind the left headline & stats
      const baseCenterX = isBackground && width >= 1024 ? width * 0.72 : width * 0.5;
      const baseCenterY = height * 0.5;

      const centerX = baseCenterX + (mouseX - width / 2) * 0.03;
      const centerY = baseCenterY + (mouseY - height / 2) * 0.03;

      // 1. Draw Technical Grid
      ctx.strokeStyle = isDark ? "rgba(51, 65, 85, 0.28)" : "rgba(203, 213, 225, 0.75)";
      ctx.lineWidth = 1;
      const gridSize = 44;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Subtle Cardinal Crosshairs through Center
      ctx.beginPath();
      ctx.moveTo(centerX - 500, centerY);
      ctx.lineTo(centerX + 500, centerY);
      ctx.moveTo(centerX, centerY - 500);
      ctx.lineTo(centerX, centerY + 500);
      ctx.strokeStyle = isDark ? "rgba(71, 85, 105, 0.35)" : "rgba(148, 163, 184, 0.4)";
      ctx.lineWidth = 0.75;
      ctx.stroke();

      // 3. Central Core Glowing Orb (#F97316 Brilliant Orange Pulse)
      const corePulse = Math.sin(tick * 0.04) * 4;
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        42 + corePulse
      );
      coreGradient.addColorStop(0, "rgba(249, 115, 22, 0.45)");
      coreGradient.addColorStop(0.5, "rgba(245, 158, 11, 0.18)");
      coreGradient.addColorStop(1, isDark ? "rgba(11, 18, 32, 0)" : "rgba(248, 250, 252, 0)");

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 44 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      // Core center dot
      ctx.fillStyle = "#F97316";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Core outer accent ring
      ctx.strokeStyle = "rgba(249, 115, 22, 0.65)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Draw Concentric Dashed Radar Rings
      const ringRadii = [65, 115, 175, 240, 310, 390, 480];
      ringRadii.forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(71, 85, 105, 0.45)" : "rgba(148, 163, 184, 0.6)";
        ctx.setLineDash([3, 6]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 5. Draw Satellites & Technical Labels
      orbits.forEach((orbit) => {
        orbit.angle += orbit.speed;
        const satX = centerX + Math.cos(orbit.angle) * orbit.radius;
        const satY = centerY + Math.sin(orbit.angle) * orbit.radius;

        // Tangent connecting vector to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(satX, satY);
        ctx.strokeStyle = isDark ? "rgba(71, 85, 105, 0.3)" : "rgba(148, 163, 184, 0.4)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Node soft aura
        ctx.fillStyle = isDark ? "rgba(249, 115, 22, 0.2)" : "rgba(249, 115, 22, 0.15)";
        ctx.beginPath();
        ctx.arc(satX, satY, orbit.size + 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Node solid body
        const nodeColor = isDark ? orbit.colorDark : orbit.colorLight;
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(satX, satY, orbit.size, 0, Math.PI * 2);
        ctx.fill();

        // High-contrast technical label (visible in both Day and Night modes)
        ctx.font = "600 10px monospace";
        ctx.fillStyle = isDark ? "#CBD5E1" : "#1E293B";
        ctx.fillText(orbit.label, satX + 9, satY + 3.5);
      });

      // 6. Rotating Radar Sweep Line & Subtle Beam Sector (#F97316)
      const sweepAngle = (tick * 0.015) % (Math.PI * 2);
      const sweepLength = 480;
      const sweepX = centerX + Math.cos(sweepAngle) * sweepLength;
      const sweepY = centerY + Math.sin(sweepAngle) * sweepLength;

      // Soft radar beam sector trail
      const trailAngle = sweepAngle - 0.28;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, 380, trailAngle, sweepAngle);
      ctx.closePath();
      const trailGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 380);
      trailGrad.addColorStop(0, "rgba(249, 115, 22, 0.12)");
      trailGrad.addColorStop(1, "rgba(249, 115, 22, 0)");
      ctx.fillStyle = trailGrad;
      ctx.fill();

      // Sharp radar beam sweep line
      const sweepGrad = ctx.createLinearGradient(centerX, centerY, sweepX, sweepY);
      sweepGrad.addColorStop(0, "rgba(249, 115, 22, 0.65)");
      sweepGrad.addColorStop(1, "rgba(249, 115, 22, 0)");

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = sweepGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [resolvedTheme, isBackground]);

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
