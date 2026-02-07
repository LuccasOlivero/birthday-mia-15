export default function Date() {
  return (
    // quiero que el alto sea la mitad de la pantalla
    <div
      className="flex flex-col justify-center items-center bg-blue-950 text-slate-200 h-52 uppercase"
      style={{ letterSpacing: "0.05em" }}
    >
      <h2 className="pb-0.5">¿Cuando?</h2>
      <p>El día 1° de agosto</p>
      <p>| 21:30hs |</p>
    </div>
  );
}
