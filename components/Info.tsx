import { GiAmpleDress } from "react-icons/gi";

export default function Info() {
  return (
    <div
      className="bg-slate-200 text-blue-950 flex flex-col justify-center items-center h-52 w-full uppercase p-4 text-center"
      style={{ letterSpacing: "0.05em" }}
    >
      <div>
        <GiAmpleDress className="text-4xl mb-2" />
      </div>
      <h2>dess code</h2>
      <h3>elegante</h3>
      <p className="lowercase">
        {"("}evita usar color azul{")"}
      </p>
    </div>
  );
}
