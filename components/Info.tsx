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

      <h2>codigo de vestimenta</h2>
      <h3>elegante</h3>
      <p className="text-sm lowercase">(evitar usar color azul)</p>
    </div>
  );
}
