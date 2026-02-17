"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Photo } from "@/app/fotos/page";

const INTERVAL_MS = 4000;

type SlideshowProps = {
  photos: Photo[];
  onClose: () => void;
};

export default function Slideshow({ photos, onClose }: SlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [isLast, setIsLast] = useState(false);

  const goNext = useCallback(() => {
    setCurrent((prev) => {
      const next = prev + 1;
      if (next >= photos.length) {
        setIsLast(true);
        return prev; // Quedarse en la última
      }
      return next;
    });
  }, [photos.length]);

  // Autoplay
  useEffect(() => {
    if (isLast) return;

    const interval = setInterval(() => {
      goNext();
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [goNext, isLast]);

  // Salir con ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Pantalla completa
  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});

    return () => {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // Precargar siguiente imagen
  useEffect(() => {
    const next = current + 1;
    if (next < photos.length) {
      const img = new Image();
      img.src = photos[next].url;
    }
  }, [current, photos]);

  if (photos.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      {/* Botón salir */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 text-white/50 hover:text-white transition-colors uppercase text-xs tracking-widest"
        style={{ letterSpacing: "0.15em" }}
      >
        ESC · Salir
      </button>

      {/* Contador */}
      <div
        className="absolute top-5 left-5 z-10 text-white/40 text-xs uppercase tracking-widest"
        style={{ letterSpacing: "0.15em" }}
      >
        {current + 1} / {photos.length}
      </div>

      {/* Barra de progreso (solo si no es la última) */}
      {!isLast && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-32 h-[2px] bg-white/20 rounded-full overflow-hidden">
          <motion.div
            key={current}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: INTERVAL_MS / 1000, ease: "linear" }}
            className="h-full bg-white/60 rounded-full"
          />
        </div>
      )}

      {/* Imagen con animación */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="w-full h-full flex items-center justify-center p-8 sm:p-16"
        >
          <img
            src={photos[current].url}
            alt={`Foto ${current + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </motion.div>
      </AnimatePresence>

      {/* Mensaje final */}
      <AnimatePresence>
        {isLast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 uppercase text-xs tracking-widest text-center"
            style={{ letterSpacing: "0.15em" }}
          >
            Fin de la presentación · ESC para salir
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
