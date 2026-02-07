export default function Banner() {
  return (
    <div
      className="relative flex flex-col justify-center items-center h-25 bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url('/fondo15.png')` }}
    >
      <div className="absolute inset-0 bg-black/65"></div>

      <h2
        className="text-slate-200 uppercase relative index-10 text-3xl text-center"
        style={{ letterSpacing: "0.2em" }}
      >
        mis 15 <br />
        mia
      </h2>
    </div>
  );
}
