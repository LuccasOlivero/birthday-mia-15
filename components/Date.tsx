import { CiCalendarDate } from "react-icons/ci";
import { SparkleOverlay } from "@/components/SparkleOverlay";
import { motion } from "framer-motion";

export default function Date() {
  return (
    <div
      className="relative flex flex-col justify-center items-center text-slate-200 min-h-52 px-4 py-8 sm:py-10 uppercase overflow-hidden"
      style={{
        letterSpacing: "0.05em",
        background: "linear-gradient(135deg, #03045e, #023e8a, #03045e)",
      }}
    >
      <SparkleOverlay />

      <motion.div
        className="relative z-10 mb-3 sm:mb-4"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: [0, -4, 0], opacity: 1 }}
        transition={{
          opacity: { duration: 0.5 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <CiCalendarDate className="text-3xl sm:text-4xl" />
      </motion.div>

      <h2 className="relative z-10 uppercase text-center font-semibold text-base sm:text-lg mb-2">
        ¿Cuándo?
      </h2>
      <p className="relative z-10 text-sm sm:text-base mb-1">
        El día 1° de agosto
      </p>
      <p className="relative z-10 text-sm sm:text-base font-light">
        | 21:00hs |
      </p>
    </div>
  );
}
