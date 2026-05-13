"use client";

import { useState } from "react";
import { BsGift } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { SparkleOverlay } from "@/components/SparkleOverlay";

const BANK_DATA = [
  { label: "CBU", value: "123123712932" },
  { label: "Alias", value: "mia.olivero" },
  { label: "Banco", value: "Santander Río" },
];

export default function Gift() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback para navegadores sin soporte
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <>
      <div
        className="relative flex flex-col justify-center items-center text-slate-200 min-h-52 px-6 py-8 sm:py-10 overflow-hidden text-center"
        style={{
          background: "linear-gradient(135deg, #03045e, #023e8a, #0077b6)",
        }}
      >
        <SparkleOverlay />

        <motion.div
          className="relative z-10 mb-3"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <BsGift className="text-3xl sm:text-4xl" />
        </motion.div>

        <p
          className="relative z-10 text-sm sm:text-base leading-relaxed max-w-xs normal-case mb-5"
          style={{ letterSpacing: "0.03em" }}
        >
          El mejor regalo es que vengas, pero si querés regalarme algo, podés
          colaborar con mis sueños y anhelos.{" "}
          <span className="font-semibold">¡Muchas gracias!</span>
        </p>

        <button
          onClick={() => setIsOpen(true)}
          className="relative z-10 uppercase text-xs sm:text-sm px-6 py-2 border-[1.5px] border-slate-200 text-slate-200 hover:bg-slate-200 hover:text-blue-950 transition-colors rounded-sm"
          style={{ letterSpacing: "0.08em" }}
        >
          Hacer un regalo
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed z-50 bottom-0 left-0 right-0 sm:inset-0 sm:flex sm:items-center sm:justify-center"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div
                className="relative text-slate-200 rounded-t-2xl sm:rounded-2xl px-6 py-8 w-full sm:max-w-sm overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #03045e, #023e8a, #0077b6)",
                }}
              >
                <SparkleOverlay />

                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-200/40 rounded-full sm:hidden" />

                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-slate-200/60 hover:text-slate-200 transition-colors text-xl leading-none"
                >
                  ✕
                </button>

                <div className="relative z-10 flex flex-col items-center gap-5 mt-2">
                  <BsGift className="text-3xl" />

                  <h2 className="uppercase text-base sm:text-lg font-semibold tracking-widest">
                    Datos bancarios
                  </h2>

                  <div className="w-full flex flex-col gap-3">
                    {BANK_DATA.map(({ label, value }) => (
                      <button
                        key={label}
                        onClick={() => handleCopy(value, label)}
                        className="w-full flex justify-between items-center py-3 px-4 transition-colors hover:bg-white/5 active:bg-white/10 rounded-sm text-left"
                        style={{
                          borderBottom: "1px solid transparent",
                          borderImage:
                            "linear-gradient(to right, transparent, #e2e8f0, transparent) 1",
                        }}
                      >
                        <span className="uppercase text-xs tracking-widest text-slate-200/60">
                          {label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-medium">
                            {value}
                          </span>
                          <AnimatePresence mode="wait">
                            {copied === label ? (
                              <motion.span
                                key="check"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="text-xs text-green-300"
                              >
                                ✓
                              </motion.span>
                            ) : (
                              <motion.span
                                key="copy"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs text-slate-200/40"
                              >
                                copiar
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-slate-200/50 normal-case text-center">
                    Tocá cualquier dato para copiarlo
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
