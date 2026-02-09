import Link from "next/link";
import { MdLocationPin } from "react-icons/md";

export default function Ubication() {
  return (
    <div
      className="min-h-52 w-full uppercase flex flex-col justify-center items-center bg-slate-200 text-blue-950 px-4 py-8 sm:py-10"
      style={{ letterSpacing: "0.05em" }}
    >
      <div>
        <MdLocationPin className="text-3xl sm:text-4xl mb-3 sm:mb-4" />
      </div>
      <h2 className="text-blue-950 uppercase text-center font-semibold text-base sm:text-lg mb-2">
        ¿dónde?
      </h2>
      <p className="text-sm sm:text-base mb-3 sm:mb-4">M&M Eventos</p>
      <Link
        target="_blank"
        href={"https://maps.app.goo.gl/82sqzPL3izJWv9jLA"}
        className="uppercase p-2 px-4 sm:px-6 border-[1.5px] border-blue-950 hover:bg-blue-950 hover:text-slate-200 transition-colors text-sm sm:text-base font-medium rounded-sm"
      >
        cómo llegar
      </Link>
    </div>
  );
}
