export default function SecondBanner() {
  return (
    <div className="bg-blue-950 px-4 sm:px-8 sm:py-12 h-52 flex items-center justify-center">
      <div className="relative max-w-md mx-auto">
        {/* Desvanecimiento izquierdo */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-linear-to-r from-blue-950 to-transparent z-10"></div>

        {/* Desvanecimiento derecho */}
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-linear-to-l from-blue-950 to-transparent z-10"></div>

        {/* Contenido con bordes */}
        <p
          className="uppercase text-center border-b-[1.5px] border-t-[1.5px] border-slate-200 text-slate-200 py-4 px-6 sm:py-5 text-sm sm:text-base leading-relaxed"
          style={{ letterSpacing: "0.05em" }}
        >
          te invito a festar <br />
          esta noche <i className="text-bold">¡inolvidable!</i> <br />
        </p>
      </div>
    </div>
  );
}
