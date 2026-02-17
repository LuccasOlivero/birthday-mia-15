"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import { Toaster, toast } from "react-hot-toast";
import Slideshow from "@/components/Slideshow";

const BUCKET_NAME = "fotos-invitados";

export type Photo = {
  name: string;
  url: string;
  createdAt: string;
};

export default function FotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [slideshowActive, setSlideshowActive] = useState(false);

  // Obtener fotos de Supabase ordenadas por fecha descendente
  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list("", {
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      const photoList: Photo[] = (data ?? [])
        .filter((file) => file.name !== ".emptyFolderPlaceholder")
        .map((file) => {
          const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(file.name);

          return {
            name: file.name,
            url: urlData.publicUrl,
            createdAt: file.created_at ?? "",
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

  // Eliminar foto
  const handleDelete = async (name: string) => {
    setDeletingName(name);
    try {
      const { error } = await supabase.storage.from(BUCKET_NAME).remove([name]);

      if (error) throw error;

      setPhotos((prev) => prev.filter((p) => p.name !== name));
      toast.success("Foto eliminada");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar la foto");
    } finally {
      setDeletingName(null);
    }
  };

  return (
    <>
      <Toaster />

      {/* Modo presentación */}
      <AnimatePresence>
        {slideshowActive && (
          <Slideshow
            photos={photos}
            onClose={() => setSlideshowActive(false)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-100">
        {/* Navbar */}
        <nav className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
          <h1
            className="uppercase font-semibold text-lg sm:text-xl tracking-widest"
            style={{ letterSpacing: "0.1em" }}
          >
            Fotos Invitados
          </h1>

          <button
            onClick={() => setSlideshowActive(true)}
            disabled={photos.length === 0}
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
                <AnimatePresence>
                  {photos.map((photo) => (
                    <motion.div
                      key={photo.name}
                      layout
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
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

                      {/* Overlay con botón eliminar */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-center p-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => {
                            if (
                              window.confirm(
                                "¿Seguro que querés eliminar esta foto?",
                              )
                            ) {
                              handleDelete(photo.name);
                            }
                          }}
                          disabled={deletingName === photo.name}
                          className="group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white text-xs uppercase font-semibold px-3 py-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed index-10 bottom-0"
                          style={{ letterSpacing: "0.05em" }}
                        >
                          {deletingName === photo.name ? (
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
                              Eliminando
                            </span>
                          ) : (
                            "Eliminar"
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
