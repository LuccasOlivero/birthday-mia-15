import { FaCamera } from "react-icons/fa";

export default function Images() {
  return (
    <div
      className="h-52 w-full uppercase flex flex-col justify-center items-center bg-slate-200 text-blue-950"
      style={{ letterSpacing: "0.05em" }}
    >
      <div>
        <FaCamera className="text-3xl mb-2" />
      </div>
      <h2 className="text-blue-950 uppercase text-center font-semibold sm:text-base">
        Quiero ver tus fotos!
      </h2>
      <p className="text-blue-950 text-center text-sm sm:text-base">
        compartila para que <br />
        todos puedan verla
      </p>
      <button className="uppercase p-1 px-2 mt-1 border-[1.5px] border-blue-950 hover:bg-blue-950 hover:text-slate-200 transition-colors mx-auto block">
        subir
      </button>
    </div>
  );
}
