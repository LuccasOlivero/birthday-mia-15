"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { Yellowtail } from "next/font/google";

const playwrite = Yellowtail({
  weight: "400",
  display: "swap",
  preload: true,
});

const PHOTOS = [
  { src: "/foto1.jpg", rotate: 3 },
  { src: "/foto2.jpg", rotate: -4 },
  { src: "/foto3.jpg", rotate: 5 },
  { src: "/foto4.jpg", rotate: -2 },
];

export default function Hero() {
  const [visibleCount, setVisibleCount] = useState(1);
  const [activePhoto, setActivePhoto] = useState(0);
  const [loadedPhotos, setLoadedPhotos] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fix autoplay iOS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const tryPlay = () => video.play().catch(() => {});

    tryPlay();

    // Fallback: intenta al primer toque si falló
    const handleTouch = () => {
      tryPlay();
      document.removeEventListener("touchstart", handleTouch);
    };
    document.addEventListener("touchstart", handleTouch);

    return () => document.removeEventListener("touchstart", handleTouch);
  }, []);

  // Agrega una foto cada 2s
  useEffect(() => {
    if (visibleCount >= PHOTOS.length) return;
    const timer = setTimeout(() => {
      setVisibleCount((v) => {
        setActivePhoto(v);
        return v + 1;
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  // Cuenta regresiva
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
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = (index: number) => {
    setLoadedPhotos((prev) => new Set(prev).add(index));
  };

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  const units = [
    { value: timeLeft.days, label: "Días" },
    { value: timeLeft.hours, label: "Horas" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Seg" },
  ];

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen px-4 py-12 overflow-hidden">
      {/* Video de fondo */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        controls={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/video2.mp4" type="video/mp4" />
        <img src="/fondo15.png" alt="" className="w-full h-full object-cover" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm mx-auto gap-8">
        {/* Stack de fotos + indicadores */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52">
            {PHOTOS.slice(0, visibleCount).map((photo, i) => (
              <motion.div
                key={photo.src}
                className="absolute inset-0 border-[6px] border-slate-100 shadow-2xl cursor-pointer"
                style={{ zIndex: i === activePhoto ? 20 : i }}
                initial={{
                  opacity: 0,
                  rotate: photo.rotate * 3,
                  scale: 1.3,
                  y: -40,
                }}
                animate={{
                  opacity: 1,
                  rotate: i === activePhoto ? photo.rotate : photo.rotate * 0.7,
                  scale: 1.2,
                  y: 0,
                }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1.5 }}
                onClick={() => setActivePhoto(i)}
              >
                {/* Skeleton */}
                <AnimatePresence>
                  {!loadedPhotos.has(i) && (
                    <motion.div
                      className="absolute inset-0 z-10"
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="w-full h-full bg-slate-300" />
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                          backgroundSize: "200% 100%",
                        }}
                        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <img
                  src={photo.src}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(i)}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* Indicadores */}
          <motion.div
            className="flex gap-2 mt-4"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {PHOTOS.slice(0, visibleCount).map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activePhoto
                    ? "bg-slate-100 w-4"
                    : "bg-slate-100/40 w-1.5"
                }`}
              />
            ))}
          </motion.div>
        </div>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center"
        >
          <h2
            className="text-slate-200 uppercase text-2xl sm:text-4xl md:text-5xl font-light"
            style={{ letterSpacing: "0.25em" }}
          >
            Mis XV
          </h2>
          <h3
            className={`${playwrite.className} text-slate-200 text-7xl sm:text-8xl`}
          >
            Mia
          </h3>
        </motion.div>

        {/* Cuenta regresiva */}
        <motion.div
          className="flex items-center justify-center gap-1 sm:gap-3 text-slate-200 font-light w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          {units.map((unit, index) => (
            <div key={unit.label} className="flex items-center gap-1 sm:gap-3">
              <div
                className="flex flex-col items-center min-w-[58px] sm:min-w-[70px]"
                style={{ letterSpacing: "0.1em" }}
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
                <div className="text-[10px] sm:text-xs mt-1 uppercase opacity-70 tracking-widest">
                  {unit.label}
                </div>
              </div>

              {index < 3 && (
                <div className="text-2xl sm:text-3xl font-light mb-4 opacity-50">
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
