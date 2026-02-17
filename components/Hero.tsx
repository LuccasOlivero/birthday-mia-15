"use client";

import { useState, useEffect } from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

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
        const days = differenceInDays(targetDate, now);
        const hours = differenceInHours(targetDate, now) % 24;
        const minutes = differenceInMinutes(targetDate, now) % 60;
        const seconds = differenceInSeconds(targetDate, now) % 60;

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div
      className="relative flex flex-col justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat px-4 py-8"
      style={{ backgroundImage: `url('/fondo15.png')` }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/65"></div>

      {/* Contenido */}
      <div className="relative z-10 text-center w-full max-w-md">
        <h2
          className="text-white uppercase text-3xl sm:text-4xl md:text-5xl font-light mb-8 sm:mb-12"
          style={{ letterSpacing: "0.25em" }}
        >
          Mis XV <br /> Mia
        </h2>

        {/* Cuenta regresiva */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-white font-light">
          {/* Días */}
          <div
            className="flex flex-col items-center min-w-[60px] sm:min-w-[70px]"
            style={{ letterSpacing: "0.15em" }}
          >
            <div className="text-3xl sm:text-4xl md:text-5xl font-light">
              {formatNumber(timeLeft.days)}
            </div>
            <div className="text-xs sm:text-sm mt-1 sm:mt-2 uppercase">
              Días
            </div>
          </div>

          {/* Separador */}
          <div className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-5">
            :
          </div>

          {/* Horas */}
          <div
            className="flex flex-col items-center min-w-[60px] sm:min-w-[70px]"
            style={{ letterSpacing: "0.15em" }}
          >
            <div className="text-3xl sm:text-4xl md:text-5xl font-light">
              {formatNumber(timeLeft.hours)}
            </div>
            <div className="text-xs sm:text-sm mt-1 sm:mt-2 uppercase">
              Horas
            </div>
          </div>

          {/* Separador */}
          <div className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-5">
            :
          </div>

          {/* Minutos */}
          <div
            className="flex flex-col items-center min-w-[60px] sm:min-w-[70px]"
            style={{ letterSpacing: "0.15em" }}
          >
            <div className="text-3xl sm:text-4xl md:text-5xl font-light">
              {formatNumber(timeLeft.minutes)}
            </div>
            <div className="text-xs sm:text-sm mt-1 sm:mt-2 uppercase">
              Minutos
            </div>
          </div>

          {/* Separador */}
          <div className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-5">
            :
          </div>

          {/* Segundos */}
          <div
            className="flex flex-col items-center min-w-[60px] sm:min-w-[70px]"
            style={{ letterSpacing: "0.15em" }}
          >
            <div className="text-3xl sm:text-4xl md:text-5xl font-light">
              {formatNumber(timeLeft.seconds)}
            </div>
            <div className="text-xs sm:text-sm mt-1 sm:mt-2 uppercase">
              Segundos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
