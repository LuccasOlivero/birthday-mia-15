"use client";

import { GiAmpleDress } from "react-icons/gi";
import { motion } from "motion/react";

export default function Info() {
  return (
    <div
      className="bg-slate-200 text-blue-950 flex flex-col justify-center items-center h-52 w-full uppercase p-4 text-center"
      style={{ letterSpacing: "0.05em" }}
    >
      <motion.div
        className="mb-2"
        animate={{ rotate: [-6, 6, -6] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "top center" }}
      >
        <GiAmpleDress className="text-4xl" />
      </motion.div>

      <h2 className="text-base sm:text-lg font-semibold text-center">
        codigo de vestimenta
        <h3>elegante</h3>
      </h2>
      <p className="text-sm sm:text-base text-center leading-relaxed max-w-xs normal-case">
        ( evitar usar color azul )
      </p>
    </div>
  );
}
