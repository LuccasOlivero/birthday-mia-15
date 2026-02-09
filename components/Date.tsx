import { CiCalendarDate } from "react-icons/ci";

export default function Date() {
  return (
    <div
      className="flex flex-col justify-center items-center bg-blue-950 text-slate-200 min-h-52 px-4 py-8 sm:py-10 uppercase"
      style={{ letterSpacing: "0.05em" }}
    >
      <div className="mb-3 sm:mb-4">
        <CiCalendarDate className="text-3xl sm:text-4xl" />
      </div>
      <h2 className="uppercase text-center font-semibold text-base sm:text-lg mb-2">
        ¿Cuándo?
      </h2>
      <p className="text-sm sm:text-base mb-1">El día 1° de agosto</p>
      <p className="text-sm sm:text-base font-light">| 21:00hs |</p>
    </div>
  );
}
