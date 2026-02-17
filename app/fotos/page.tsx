"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import { Toaster, toast } from "react-hot-toast";
import Slideshow from "@/components/Slideshow";

const BUCKET_NAME = "fotos-invitados";

export type Photo = {
  id: string;
  name: string;
  url: string;
  aprobada: boolean;
  createdAt: string;
};

export default function FotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [slideshowActive, setSlideshowActive] = useState(false);

  // Obtener fotos con su estado de aprobación
  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Obtener registros de la BD
      const { data: dbPhotos, error: dbError } = await supabase
        .from("fotos")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;

      // 2. Obtener URLs públicas
      const photoList: Photo[] = (dbPhotos ?? []).map((photo) => {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(photo.nombre);

        return {
          id: photo.id,
          name: photo.nombre,
          url: urlData.publicUrl,
          aprobada: photo.aprobada,
          createdAt: photo.created_at,
        };
      });

      setPhotos(photoList);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar las fotos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Toggle estado de aprobación
  const toggleAprobacion = async (id: string, currentState: boolean) => {
    setUpdatingId(id);

    // Optimistic update
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, aprobada: !currentState } : p)),
    );

    try {
      const { error } = await supabase
        .from("fotos")
        .update({ aprobada: !currentState })
        .eq("id", id);

      if (error) throw error;

      toast.success(!currentState ? "Foto aprobada ✓" : "Aprobación retirada", {
        position: "top-center",
        duration: 2000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar");

      // Revertir optimistic update
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, aprobada: currentState } : p)),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtrar solo fotos aprobadas para slideshow
  const approvedPhotos = photos.filter((p) => p.aprobada);

  return (
    <>
      <Toaster />

      {/* Modo presentación */}
      <AnimatePresence>
        {slideshowActive && (
          <Slideshow
            photos={approvedPhotos}
            onClose={() => setSlideshowActive(false)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-100">
        {/* Navbar */}
        <nav className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
          <div>
            <h1
              className="uppercase font-semibold text-lg sm:text-xl tracking-widest"
              style={{ letterSpacing: "0.1em" }}
            >
              Fotos Invitados
            </h1>
            <p
              className="text-xs text-white/50 mt-1 normal-case tracking-wide"
              style={{ letterSpacing: "0.05em" }}
            >
              {approvedPhotos.length} de {photos.length} aprobadas
            </p>
          </div>

          <button
            onClick={() => setSlideshowActive(true)}
            disabled={approvedPhotos.length === 0}
            className="uppercase text-xs sm:text-sm font-semibold px-4 py-2 border-[1.5px] border-white hover:bg-white hover:text-blue-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
            style={{ letterSpacing: "0.05em" }}
          >
            Comenzar presentación
          </button>
        </nav>

        {/* Contenido */}
        <main className="px-4 py-8 sm:px-8 max-w-6xl mx-auto">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-blue-950 border-t-transparent rounded-full"
              />
              <p
                className="text-blue-950 uppercase text-sm tracking-widest"
                style={{ letterSpacing: "0.1em" }}
              >
                Cargando fotos...
              </p>
            </div>
          )}

          {/* Sin fotos */}
          {!loading && photos.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-3 text-blue-950"
            >
              <p
                className="uppercase text-sm tracking-widest"
                style={{ letterSpacing: "0.1em" }}
              >
                Aún no hay fotos subidas
              </p>
            </motion.div>
          )}

          {/* Grilla de fotos */}
          {!loading && photos.length > 0 && (
            <>
              <p
                className="uppercase text-xs text-blue-950/50 mb-6 tracking-widest"
                style={{ letterSpacing: "0.1em" }}
              >
                {photos.length} {photos.length === 1 ? "foto" : "fotos"} ·
                ordenadas por más recientes
              </p>

              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {photos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative group aspect-square rounded-lg overflow-hidden bg-slate-200 shadow-sm"
                  >
                    {/* Imagen */}
                    <img
                      src={photo.url}
                      alt="Foto invitado"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Overlay con botón toggle */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-center p-4">
                      <motion.button
                        initial={{ scale: 0.8 }}
                        onClick={() =>
                          toggleAprobacion(photo.id, photo.aprobada)
                        }
                        disabled={updatingId === photo.id}
                        className={`
                          group-hover:opacity-100 transition-opacity duration-200
                          text-white text-xs uppercase font-semibold px-3 py-2 rounded-sm
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${
                            photo.aprobada
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }
                        `}
                        style={{ letterSpacing: "0.05em" }}
                      >
                        {updatingId === photo.id ? (
                          <span className="flex items-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="block w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                            />
                            Actualizando
                          </span>
                        ) : photo.aprobada ? (
                          "✓ Aprobada"
                        ) : (
                          "No aprobada"
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
