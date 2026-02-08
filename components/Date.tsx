import { CiCalendarDate } from "react-icons/ci";

export default function Date() {
  return (
    <div
      className="flex flex-col justify-center items-center bg-blue-950 text-slate-200 h-52 uppercase"
      style={{ letterSpacing: "0.05em" }}
    >
      <div className="mb-2">
        <CiCalendarDate className="text-3xl" />
      </div>
      <h2 className="pb-0.5">¿Cuando?</h2>
      <p>El día 1° de agosto</p>
      <p>| 21:30hs |</p>
    </div>
  );
}
