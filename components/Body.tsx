export default function Body() {
  return (
    <div className="bg-slate-200 px-4 py-8 sm:px-8 sm:py-12 min-h-52 flex items-center">
      <div className="relative max-w-md mx-auto w-full">
        {/* Desvanecimiento izquierdo */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-slate-200 to-transparent z-10"></div>

        {/* Desvanecimiento derecho */}
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-slate-200 to-transparent z-10"></div>

        {/* Contenido con bordes */}
        <p
          className="uppercase text-center border-b-[1.5px] border-t-[1.5px] border-blue-950 text-blue-950 py-4 sm:py-5 text-sm sm:text-base font-semibold leading-relaxed"
          style={{ letterSpacing: "0.05em" }}
        >
          Un día lleno de sueños, <br />
          risas y recuerdos está <br />
          por llegar. Por esa razón, <br />
          te invito a festejar mis 15 años
        </p>
      </div>
    </div>
  );
}
