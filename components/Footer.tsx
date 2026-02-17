import SecretButton from "./SecretButton";

export default function Footer() {
  return (
    <footer className="bg-slate-200 text-blue-950 flex flex-col items-center justify-center p-4 h-26 relative">
      <div
        className="container mx-auto px-4 text-center text-xl"
        style={{ letterSpacing: "0.2rem" }}
      >
        <p className="uppercase">¡te esperamos!</p>
      </div>

      <div className="absolute bottom-0 right-0 mb-2 mr-2">
        <SecretButton />
      </div>
    </footer>
  );
}
