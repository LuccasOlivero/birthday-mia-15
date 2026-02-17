"use client";

import { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

// Constantes de validación
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const BUCKET_NAME = "fotos-invitados";

type UploadStatus = "idle" | "preview" | "uploading";

export default function Images() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Validar archivo
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Solo se permiten imágenes (JPG, PNG, WEBP, GIF)";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `La imagen no puede superar los ${MAX_SIZE_MB}MB`;
    }
    return null;
  };

  // Resetear todo al estado inicial
  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setSelectedFile(null);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  };

  // Manejar selección de archivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error, { position: "top-center" });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setStatus("preview");
  };

  // Subir imagen a Supabase
  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus("uploading");

    try {
      const timestamp = Date.now();
      const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${timestamp}_${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Volver al estado inicial y mostrar notificación
      handleCancel();
      toast.success("¡Foto subida con éxito! 🎉", {
        position: "top-center",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error al subir:", error);
      toast.error("Error al subir la foto. Intenta nuevamente.", {
        position: "top-center",
        duration: 4000,
      });
      setStatus("preview");
    }
  };

  return (
    <>
      <Toaster />

      <div
        className="min-h-52 w-full uppercase flex flex-col justify-center items-center bg-slate-200 text-blue-950 px-4 py-8 sm:py-10"
        style={{ letterSpacing: "0.05em" }}
      >
        {/* Input oculto */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <AnimatePresence mode="wait">
          {/* Estado: idle */}
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <FaCamera className="text-3xl sm:text-4xl mb-1" />
              <h2 className="text-base sm:text-lg font-semibold text-center">
                ¡Momento selfie!
              </h2>
              <p className="text-sm sm:text-base text-center leading-relaxed max-w-xs normal-case">
                Te invito a tomarte una selfie en el cumple y compartirla
                conmigo por acá, ¡y si querés ahora también!
              </p>
              <button
                onClick={() => inputRef.current?.click()}
                className="uppercase p-2 px-6 mt-2 border-[1.5px] border-blue-950 hover:bg-blue-950 hover:text-slate-200 transition-colors text-sm sm:text-base font-medium rounded-sm"
              >
                Subir foto
              </button>
            </motion.div>
          )}

          {/* Estado: preview */}
          {status === "preview" && preview && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4 w-full max-w-xs"
            >
              <h2 className="text-base sm:text-lg font-semibold text-center">
                Vista previa
              </h2>

              {/* Preview de la imagen */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-blue-950">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs text-blue-950/60 normal-case text-center">
                {selectedFile?.name} ·{" "}
                {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)}MB
              </p>

              {/* Botones */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCancel}
                  className="flex-1 uppercase p-2 px-4 border-[1.5px] border-blue-950 hover:bg-blue-950 hover:text-slate-200 transition-colors text-sm font-medium rounded-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 uppercase p-2 px-4 bg-blue-950 text-slate-200 hover:bg-blue-900 transition-colors text-sm font-medium rounded-sm border-[1.5px] border-blue-950"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          )}

          {/* Estado: uploading */}
          {status === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-blue-950 border-t-transparent rounded-full"
              />
              <p className="text-sm sm:text-base font-medium">
                Subiendo foto...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
