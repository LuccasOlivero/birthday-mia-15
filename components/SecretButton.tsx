"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

// Botón secreto: 3 clicks rápidos en menos de 3 segundos
export default function SecretButton() {
  const clicksRef = useRef<number[]>([]);
  const router = useRouter();

  const handleClick = () => {
    const now = Date.now();
    clicksRef.current = [...clicksRef.current, now].filter(
      (t) => now - t < 5000,
    );

    if (clicksRef.current.length >= 3) {
      clicksRef.current = [];
      router.push("/fotos");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-10 h-10 cursor-default select-none"
      aria-hidden="true"
    />
  );
}
