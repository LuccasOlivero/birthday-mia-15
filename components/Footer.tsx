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

      <div className="absolute bottom-2 left-3 w-full text-center">
        <p className="text-[10px]  text-blue-950/70 normal-case tracking-wide">
          Desarrollador por{" "}
          <a
            href="https://www.instagram.com/luccas.olivero/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-950/60 transition-colors"
          >
            Ing. Luccas
          </a>
        </p>
      </div>
    </footer>
  );
}
