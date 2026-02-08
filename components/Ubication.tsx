import { MdLocationPin } from "react-icons/md";

export default function Ubication() {
  return (
    <div
      className="h-52 w-full uppercase flex flex-col justify-center items-center bg-slate-200 text-blue-950"
      style={{ letterSpacing: "0.05em" }}
    >
      <div>
        <MdLocationPin className="text-3xl mb-2" />
      </div>
      <h2>¿donde?</h2>
      <p>cochocho vargas</p>
      <button className="uppercase p-1 mt-0.5 border-[1.5px] border-blue-950 hover:bg-blue-950 hover:text-slate-200 transition-colors">
        como llegar
      </button>
    </div>
  );
}
