"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  repeatDelay: number;
  opacity: number;
  color: string;
}

function generateSparkles(count: number): Sparkle[] {
  const colors = [
    "rgba(255, 255, 255, 1)",
    "rgba(200, 225, 255, 1)",
    "rgba(180, 210, 255, 1)",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 90,
    y: Math.random() * 70,
    size: Math.random() * 4.5 + 1.8,
    duration: Math.random() * 2 + 2,
    delay: Math.random() * 6,
    repeatDelay: Math.random() * 4 + 2,
    opacity: Math.random() * 0.6 + 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

function SparkleParticle({ sparkle }: { sparkle: Sparkle }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: `${sparkle.x}%`,
        top: `${sparkle.y}%`,
        width: sparkle.size,
        height: sparkle.size,
        background: sparkle.color,
        boxShadow: `0 0 ${sparkle.size * 3}px ${sparkle.color}`,
      }}
      animate={{ opacity: [0, sparkle.opacity, 0] }}
      transition={{
        duration: sparkle.duration,
        delay: sparkle.delay,
        repeat: Infinity,
        repeatDelay: sparkle.repeatDelay,
        ease: "easeInOut",
      }}
    />
  );
}

export function SparkleOverlay() {
  const [sparkles] = useState<Sparkle[]>(() => generateSparkles(12));

  return (
    <>
      {sparkles.map((sparkle) => (
        <SparkleParticle key={sparkle.id} sparkle={sparkle} />
      ))}
    </>
  );
}
