"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import toast, { Toaster } from "react-hot-toast";
import { quiz } from "../helpers/quiz";

interface Invitado {
  nombre: string;
  apellido: string;
  esMenor: boolean | null;
}

type Option = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: number;
  question: string;
  options: Option[];
};

// Reemplaza con tu URL de Apps Script
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwx6wroRM1HwzEMhG3e2rJSZFAe6s9db1CzgrcP7XhYaUjXkGx3ySSr7G2VEEVPO8SsDw/exec";

export default function Form() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    asistencia: "",
    cantidadPersonas: "1",
    restriccionesAlimentarias: "",
    mensaje: "",
  });

  const [invitadosAdicionales, setInvitadosAdicionales] = useState<Invitado[]>(
    [],
  );

  const [mostrarQuiz, setMostrarQuiz] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestasQuiz, setRespuestasQuiz] = useState<Record<number, number>>(
    {},
  );
  const [enviando, setEnviando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "cantidadPersonas") {
      const cantidad = parseInt(value);
      const adicionales = cantidad - 1;

      if (adicionales > 0) {
        setInvitadosAdicionales(
          Array.from(
            { length: adicionales },
            (_, i) =>
              invitadosAdicionales[i] || {
                nombre: "",
                apellido: "",
                esMenor: null,
              },
          ),
        );
      } else {
        setInvitadosAdicionales([]);
      }
    }
  };

  const handleInvitadoChange = (
    index: number,
    field: keyof Invitado,
    value: string | boolean | null,
  ) => {
    setInvitadosAdicionales((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleEdadChange = (index: number, esMenor: boolean) => {
    setInvitadosAdicionales((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], esMenor };
      return updated;
    });
  };

  const handleRespuestaQuiz = (preguntaId: number, opcionIndex: number) => {
    setRespuestasQuiz((prev) => ({
      ...prev,
      [preguntaId]: opcionIndex,
    }));

    setTimeout(() => {
      if (preguntaActual < quiz.questions.length - 1) {
        setPreguntaActual(preguntaActual + 1);
      }
    }, 300);
  };

  const calcularPuntaje = () => {
    let puntaje = 0;
    quiz.questions.forEach((pregunta: Question) => {
      const respuestaIndex = respuestasQuiz[pregunta.id];
      if (
        respuestaIndex !== undefined &&
        pregunta.options[respuestaIndex]?.isCorrect
      ) {
        puntaje++;
      }
    });
    return puntaje;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si no asiste, enviar directamente
    if (formData.asistencia === "no") {
      setEnviando(true);

      try {
        const response = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify({
            formData,
            invitadosAdicionales: [],
            puntajeQuiz: undefined,
          }),
        });

        const result = await response.json();

        if (result.success) {
          toast.success(
            "Lamentamos que no puedas asistir. ¡Gracias por avisar!",
            {
              duration: 4000,
              position: "top-center",
            },
          );

          window.scrollTo({ top: 0, behavior: "smooth" });

          setTimeout(() => {
            setFormData({
              nombre: "",
              apellido: "",
              asistencia: "",
              cantidadPersonas: "1",
              restriccionesAlimentarias: "",
              mensaje: "",
            });
          }, 500);
        } else {
          toast.error(result.error || "Error al enviar el formulario", {
            duration: 4000,
            position: "top-center",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          "Error al enviar el formulario. Por favor intenta nuevamente.",
          {
            duration: 4000,
            position: "top-center",
          },
        );
      } finally {
        setEnviando(false);
      }

      return;
    }

    // Validar que todos los acompañantes tengan edad seleccionada
    const todosConEdad = invitadosAdicionales.every(
      (invitado) => invitado.esMenor !== null,
    );

    if (!todosConEdad) {
      toast.error("Por favor, indica la edad de todos los acompañantes", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    // Mostrar quiz solo si confirma asistencia
    if (!mostrarQuiz) {
      setMostrarQuiz(true);
      return;
    }
  };

  const handleFinalizarQuiz = async () => {
    const todasRespondidas = quiz.questions.every(
      (pregunta: Question) => respuestasQuiz[pregunta.id] !== undefined,
    );

    if (!todasRespondidas) {
      toast.error("Por favor, responde todas las preguntas del quiz", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setEnviando(true);

    const puntaje = calcularPuntaje();

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          formData,
          invitadosAdicionales,
          puntajeQuiz: puntaje,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `¡Confirmación enviada! Obtuviste ${puntaje} de ${quiz.questions.length} puntos en el quiz.`,
          {
            duration: 5000,
            position: "top-center",
          },
        );

        window.scrollTo({ top: 0, behavior: "smooth" });

        setTimeout(() => {
          setFormData({
            nombre: "",
            apellido: "",
            asistencia: "",
            cantidadPersonas: "1",
            restriccionesAlimentarias: "",
            mensaje: "",
          });
          setInvitadosAdicionales([]);
          setMostrarQuiz(false);
          setPreguntaActual(0);
          setRespuestasQuiz({});
        }, 500);
      } else {
        toast.error(result.error || "Error al enviar el formulario", {
          duration: 4000,
          position: "top-center",
        });
        setMostrarQuiz(false);
        setPreguntaActual(0);
        setRespuestasQuiz({});
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "Error al enviar el formulario. Por favor intenta nuevamente.",
        {
          duration: 4000,
          position: "top-center",
        },
      );
      setMostrarQuiz(false);
      setPreguntaActual(0);
      setRespuestasQuiz({});
    } finally {
      setEnviando(false);
    }
  };

  const preguntaQuiz = quiz.questions[preguntaActual];
  const esUltimaPregunta = preguntaActual === quiz.questions.length - 1;

  return (
    <>
      {/* Toaster para notificaciones */}
      <Toaster
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div
        className="relative flex flex-col justify-center items-center min-h-[85vh] bg-cover bg-center bg-no-repeat px-4 py-6 sm:py-8"
        style={{ backgroundImage: `url('/fondo15.png')` }}
      >
        <div className="absolute inset-0 bg-black/65"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto rounded-lg shadow-md p-6 sm:p-8 bg-slate-200 relative z-10 w-full"
        >
          <AnimatePresence mode="wait">
            {!mostrarQuiz ? (
              <motion.div
                key="formulario"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3
                  className="text-2xl font-semibold text-center text-blue-950 mb-6 uppercase"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Confirmación de Asistencia
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nombre */}
                  <div>
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-blue-950 mb-1"
                    >
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      required
                      disabled={enviando}
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Apellido */}
                  <div>
                    <label
                      htmlFor="apellido"
                      className="block text-sm font-medium text-blue-950 mb-1"
                    >
                      Apellido *
                    </label>
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      required
                      disabled={enviando}
                      value={formData.apellido}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Asistencia */}
                  <div>
                    <label
                      htmlFor="asistencia"
                      className="block text-sm font-medium text-blue-950 mb-1"
                    >
                      ¿Confirmas tu asistencia? *
                    </label>
                    <select
                      id="asistencia"
                      name="asistencia"
                      required
                      disabled={enviando}
                      value={formData.asistencia}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Selecciona una</option>
                      <option value="si">Sí, asistiré</option>
                      <option value="no">No podré asistir</option>
                    </select>
                  </div>

                  {/* Cantidad de personas */}
                  {formData.asistencia === "si" && (
                    <>
                      <div>
                        <label
                          htmlFor="cantidadPersonas"
                          className="block text-sm font-medium text-blue-950 mb-1"
                        >
                          ¿Cuántas personas asistirán? *
                        </label>
                        <select
                          id="cantidadPersonas"
                          name="cantidadPersonas"
                          required
                          disabled={enviando}
                          value={formData.cantidadPersonas}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="1">1 persona</option>
                          <option value="2">2 personas</option>
                          <option value="3">3 personas</option>
                          <option value="4">4 personas</option>
                          <option value="5">5 personas</option>
                        </select>
                      </div>

                      {/* Invitados adicionales */}
                      {invitadosAdicionales.length > 0 && (
                        <div className="border-t-2 border-blue-950 pt-4 mt-4">
                          <h4
                            className="text-lg font-semibold text-blue-950 mb-3 uppercase text-center"
                            style={{ letterSpacing: "0.05em" }}
                          >
                            Datos de acompañantes
                          </h4>
                          <AnimatePresence>
                            {invitadosAdicionales.map((invitado, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{
                                  duration: 0.4,
                                  delay: index * 0.1,
                                  ease: "easeOut",
                                }}
                                className="mb-4 p-3 bg-white rounded-md overflow-hidden"
                              >
                                <p className="text-sm font-medium text-blue-950 mb-2">
                                  Acompañante {index + 1}
                                </p>
                                <div className="space-y-3">
                                  <div>
                                    <label
                                      htmlFor={`invitado-nombre-${index}`}
                                      className="block text-xs font-medium text-gray-700 mb-1"
                                    >
                                      Nombre *
                                    </label>
                                    <input
                                      type="text"
                                      id={`invitado-nombre-${index}`}
                                      required
                                      disabled={enviando}
                                      value={invitado.nombre}
                                      onChange={(e) =>
                                        handleInvitadoChange(
                                          index,
                                          "nombre",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`invitado-apellido-${index}`}
                                      className="block text-xs font-medium text-gray-700 mb-1"
                                    >
                                      Apellido *
                                    </label>
                                    <input
                                      type="text"
                                      id={`invitado-apellido-${index}`}
                                      required
                                      disabled={enviando}
                                      value={invitado.apellido}
                                      onChange={(e) =>
                                        handleInvitadoChange(
                                          index,
                                          "apellido",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                  </div>

                                  {/* Selección de edad */}
                                  <div>
                                    <p className="text-xs font-medium text-gray-700 mb-2">
                                      Edad del acompañante *
                                    </p>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          id={`invitado-menor-${index}`}
                                          name={`edad-${index}`}
                                          disabled={enviando}
                                          checked={invitado.esMenor === true}
                                          onChange={() =>
                                            handleEdadChange(index, true)
                                          }
                                          className="w-4 h-4 text-blue-950 border-gray-300 focus:ring-2 focus:ring-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <label
                                          htmlFor={`invitado-menor-${index}`}
                                          className="text-xs font-medium text-gray-700"
                                        >
                                          Es menor de 13 años
                                        </label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          id={`invitado-mayor-${index}`}
                                          name={`edad-${index}`}
                                          disabled={enviando}
                                          checked={invitado.esMenor === false}
                                          onChange={() =>
                                            handleEdadChange(index, false)
                                          }
                                          className="w-4 h-4 text-blue-950 border-gray-300 focus:ring-2 focus:ring-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <label
                                          htmlFor={`invitado-mayor-${index}`}
                                          className="text-xs font-medium text-gray-700"
                                        >
                                          Tiene 13 años o más
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Restricciones alimentarias */}
                      <div>
                        <label
                          htmlFor="restriccionesAlimentarias"
                          className="block text-sm font-medium text-blue-950 mb-1"
                        >
                          Restricciones alimentarias
                        </label>
                        <input
                          type="text"
                          id="restriccionesAlimentarias"
                          name="restriccionesAlimentarias"
                          disabled={enviando}
                          placeholder="Ej: vegetariano, celíaco, alérgico a..."
                          value={formData.restriccionesAlimentarias}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Mensaje adicional */}
                      <div>
                        <label
                          htmlFor="mensaje"
                          className="block text-sm font-medium text-blue-950 mb-1"
                        >
                          Mensaje para Mia (opcional)
                        </label>
                        <textarea
                          id="mensaje"
                          name="mensaje"
                          rows={3}
                          disabled={enviando}
                          placeholder="Escribe un mensaje especial..."
                          value={formData.mensaje}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </>
                  )}

                  {/* Botón de envío */}
                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full bg-blue-950 text-white py-3 px-4 rounded-md font-semibold uppercase tracking-wide hover:bg-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {enviando ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Enviando...
                      </>
                    ) : (
                      "Confirmar"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Encabezado del Quiz */}
                <div className="text-center mb-6">
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-semibold text-blue-950 mb-3 uppercase"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    ¡Gracias por confirmar tu asistencia, te espero!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-blue-950 mb-4"
                  >
                    Ahora unas preguntas sobre mí, ¡y si contestas todas bien,
                    hay premio!
                  </motion.p>
                  <motion.h4
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg font-semibold text-blue-950 uppercase"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {quiz.title}
                  </motion.h4>
                </div>

                {/* Indicador de progreso */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4"
                >
                  <div className="flex justify-between text-xs text-blue-950 mb-2">
                    <span>
                      Pregunta {preguntaActual + 1} de {quiz.questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((preguntaActual + 1) / quiz.questions.length) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                      className="bg-blue-950 h-2 rounded-full"
                    />
                  </div>
                </motion.div>

                {/* Pregunta actual */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={preguntaActual}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-5 rounded-md mb-4"
                  >
                    <p className="text-base font-medium text-blue-950 mb-4">
                      {preguntaQuiz.question}
                    </p>
                    <div className="space-y-3">
                      {preguntaQuiz.options.map((opcion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="radio"
                            id={`pregunta-${preguntaQuiz.id}-opcion-${index}`}
                            name={`pregunta-${preguntaQuiz.id}`}
                            disabled={enviando}
                            checked={respuestasQuiz[preguntaQuiz.id] === index}
                            onChange={() =>
                              handleRespuestaQuiz(preguntaQuiz.id, index)
                            }
                            className="w-5 h-5 text-blue-950 border-gray-300 focus:ring-2 focus:ring-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <label
                            htmlFor={`pregunta-${preguntaQuiz.id}-opcion-${index}`}
                            className="text-sm text-gray-700 cursor-pointer flex-1"
                          >
                            {opcion.text}
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Botón finalizar */}
                {esUltimaPregunta &&
                  respuestasQuiz[preguntaQuiz.id] !== undefined && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      onClick={handleFinalizarQuiz}
                      disabled={enviando}
                      className="w-full bg-blue-950 text-white py-3 px-4 rounded-md font-semibold uppercase tracking-wide hover:bg-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {enviando ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Enviando...
                        </>
                      ) : (
                        "Finalizar Quiz"
                      )}
                    </motion.button>
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
