"use client";

import { useState } from "react";
import { PiMusicNoteSimpleBold } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";

export default function Playlist() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!value.trim()) return;
    setSent(true);
    setValue("");
    setTimeout(() => {
      setSent(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <div
      className="bg-slate-200 text-blue-950 flex flex-col justify-center items-center w-full uppercase p-4 text-center py-8 sm:py-10"
      style={{ letterSpacing: "0.05em" }}
    >
      <motion.div
        className="mb-2"
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top center" }}
      >
        <PiMusicNoteSimpleBold className="text-4xl" />
      </motion.div>

      <p className="text-sm sm:text-base text-center leading-relaxed max-w-xs normal-case mb-3">
        ¡Ayudame sugiriendo las canciones que pensás que no pueden faltar en la
        fiesta!
      </p>

      <div className="w-full max-w-xs flex flex-col items-center gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.p
                    key="thanks"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-blue-950/60 normal-case text-center pb-2"
                  >
                    ¡Gracias por tu sugerencia! 🎶
                  </motion.p>
                ) : (
                  <motion.input
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Artista - Canción..."
                    className="w-full bg-transparent border-b border-t-0 border-x-0 border-blue-950/40 focus:border-blue-950 focus:outline-none text-blue-950 placeholder:text-blue-950/30 text-sm py-2 text-center transition-colors mb-1 normal-case"
                    style={{ letterSpacing: "0.03em" }}
                    autoFocus
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={isOpen ? handleSend : () => setIsOpen(true)}
          className="uppercase p-2 px-4 sm:px-6 border-[1.5px] border-blue-950 hover:bg-blue-950 hover:text-slate-200 transition-colors text-sm sm:text-base font-medium rounded-sm"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isOpen ? "enviar" : "sugerir"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? "Enviar" : "Sugerir canción"}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
