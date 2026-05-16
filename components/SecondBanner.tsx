import { SparkleOverlay } from "@/components/SparkleOverlay";

export default function SecondBanner() {
  return (
    <div
      className="relative px-4 sm:px-8 sm:py-12 h-52 flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #03045e, #023e8a, #03045e)",
      }}
    >
      <SparkleOverlay />

      <div className="relative z-10 max-w-md mx-auto">
        <p
          className="uppercase text-center text-slate-200 py-4 px-10 sm:py-5 sm:px-12 text-sm leading-relaxed sm:text-lg font-semibold "
          style={{
            letterSpacing: "0.05em",
            borderTop: "1.5px solid transparent",
            borderBottom: "1.5px solid transparent",
            borderImage:
              "linear-gradient(to right, transparent, #e2e8f0, transparent) 1",
          }}
        >
          veni a festejar <br />
          esta noche <br />
          <i className="text-bold">¡inolvidable!</i> <br />
        </p>
      </div>
    </div>
  );
}
