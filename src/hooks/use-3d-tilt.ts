"use client";

import { useRef, useState, useEffect } from "react";

export function use3DTilt(maxRotation = 8) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
  });
  const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({
    opacity: 0,
    background: `radial-gradient(circle 200px at 0px 0px, var(--primary-soft-2) 0%, transparent 80%)`,
    transition: "opacity 0.5s ease",
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      const width = rect.width;
      const height = rect.height;

      // Normalize mouse coordinates to [-0.5, 0.5]
      const normalizedX = x / width - 0.5;
      const normalizedY = y / height - 0.5;

      // Calculate rotations
      const rotateX = -(normalizedY * maxRotation).toFixed(2);
      const rotateY = (normalizedX * maxRotation).toFixed(2);

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)",
      });

      // Update glow overlay position
      setGlowStyle({
        opacity: 0.8,
        background: `radial-gradient(circle 200px at ${x}px ${y}px, var(--primary-soft-2) 0%, transparent 80%)`,
        transition: "opacity 0.2s ease, background 0.05s ease",
      });
    };

    const handleMouseLeave = () => {
      setStyle({
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
      });

      setGlowStyle({
        opacity: 0,
        background: `radial-gradient(circle 200px at 0px 0px, var(--primary-soft-2) 0%, transparent 80%)`,
        transition: "opacity 0.5s ease",
      });
    };

    const handleMouseEnter = () => {
      setGlowStyle(prev => ({
        ...prev,
        opacity: 0.8,
      }));
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [maxRotation]);

  return { ref: elementRef, style, glowStyle };
}
