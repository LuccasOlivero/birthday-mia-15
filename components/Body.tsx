export default function Body() {
  return (
    <div className="bg-slate-200 px-4 py-8 sm:px-8 sm:py-12 h-52">
      <div className="relative max-w-md mx-auto">
        {/* Desvanecimiento izquierdo */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-linear-to-r from-slate-200 to-transparent z-10"></div>

        {/* Desvanecimiento derecho */}
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-linear-to-l from-slate-200 to-transparent z-10"></div>

        {/* Contenido con bordes */}
        <p
          className="uppercase text-center border-b-[.5px] border-t-[.5px] border-blue-950 text-blue-950 py-4 sm:py-5 font-semibold text-sm sm:text-base leading-relaxed"
          style={{ letterSpacing: "0.05em" }}
        >
          Un día lleno de sueños <br />
          risas y recuerdos está <br />
          por llegar. por esa razón <br />
          te invito a celebrar mis 15 años, <br />
          el día 1° de agosto.
        </p>
      </div>
    </div>
  );
}
