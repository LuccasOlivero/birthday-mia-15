"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { Yellowtail } from "next/font/google";
import { SparkleOverlay } from "@/components/SparkleOverlay";

const playwrite = Yellowtail({
  weight: "400",
  display: "swap", // ← evita el bloqueo de render
  preload: true, // ← descarga anticipada
});

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-08-01T00:00:00");

    const calculateTimeLeft = () => {
      const now = new Date();
      if (now < targetDate) {
        setTimeLeft({
          days: differenceInDays(targetDate, now),
          hours: differenceInHours(targetDate, now) % 24,
          minutes: differenceInMinutes(targetDate, now) % 60,
          seconds: differenceInSeconds(targetDate, now) % 60,
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  const units = [
    { value: timeLeft.days, label: "Días" },
    { value: timeLeft.hours, label: "Horas" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Seg" },
  ];

  return (
    <div
      className="relative flex flex-col justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat px-4 py-8 overflow-hidden"
      style={{ backgroundImage: `url('/fondo15.png')` }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <SparkleOverlay />

      <div className="relative z-10 text-center w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-4 sm:mb-12 text-center"
        >
          <h2
            className="text-white uppercase text-3xl sm:text-4xl md:text-5xl font-light"
            style={{ letterSpacing: "0.25em" }}
          >
            Mis XV
          </h2>
          <h3
            className={`${playwrite.className} text-white text-8xl sm:text-5xl md:text-8xl mt-2`}
          >
            Mia
          </h3>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-2 sm:gap-3 text-white font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          {units.map((unit, index) => (
            <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
              <div
                className="flex flex-col items-center min-w-[60px] sm:min-w-[70px]"
                style={{ letterSpacing: "0.15em" }}
              >
                <motion.div
                  className="text-3xl sm:text-4xl md:text-5xl font-light"
                  key={unit.value}
                  initial={{ opacity: 0.5, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {formatNumber(unit.value)}
                </motion.div>
                <div className="text-xs sm:text-sm mt-1 sm:mt-2 uppercase opacity-80">
                  {unit.label}
                </div>
              </div>

              {index < 3 && (
                <div className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-5 opacity-60">
                  :
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
