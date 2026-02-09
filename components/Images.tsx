import { FaCamera } from "react-icons/fa";

export default function Images() {
  return (
    <div
      className="min-h-52 w-full uppercase flex flex-col justify-center items-center bg-slate-200 text-blue-950 px-4 py-8 sm:py-10"
      style={{ letterSpacing: "0.05em" }}
    >
      <div>
        <FaCamera className="text-3xl sm:text-4xl mb-3 sm:mb-4" />
      </div>
      <h2 className="text-blue-950 uppercase text-center font-semibold text-base sm:text-lg mb-2">
        ¡momento selfie!
      </h2>
      <p className="text-blue-950 text-center text-sm sm:text-base leading-relaxed max-w-md">
        Te invito a tomarte una selfie en el <br className="hidden sm:block" />
        cumple y compartirlas conmigo por acá <br className="hidden sm:block" />
        y si querés ahora también!
      </p>
      <button className="uppercase p-2 px-4 sm:px-6 mt-4 sm:mt-5 border-[1.5px] border-blue-950 hover:bg-blue-950 hover:text-slate-200 transition-colors text-sm sm:text-base font-medium rounded-sm">
        subir
      </button>
    </div>
  );
}
