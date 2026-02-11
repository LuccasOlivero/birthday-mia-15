"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { quiz } from "../helpers/quiz";
import { refresh } from "next/cache";

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

    // Si cambia la cantidad de personas, ajustar invitados adicionales
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

    // Avanzar a la siguiente pregunta después de un breve delay
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Si no asiste, enviar directamente
    if (formData.asistencia === "no") {
      console.log("Datos del formulario:", formData);
      alert("Lamentamos que no puedas asistir. ¡Gracias por avisar!");
      return;
    }

    // Validar que todos los acompañantes tengan edad seleccionada
    const todosConEdad = invitadosAdicionales.every(
      (invitado) => invitado.esMenor !== null,
    );

    if (!todosConEdad) {
      alert("Por favor, indica la edad de todos los acompañantes");
      return;
    }

    // Mostrar quiz solo si confirma asistencia
    if (!mostrarQuiz) {
      setMostrarQuiz(true);
      return;
    }
  };

  const handleFinalizarQuiz = () => {
    // Validar que todas las preguntas estén respondidas
    const todasRespondidas = quiz.questions.every(
      (pregunta: Question) => respuestasQuiz[pregunta.id] !== undefined,
    );

    if (!todasRespondidas) {
      alert("Por favor, responde todas las preguntas del quiz");
      return;
    }

    // Calcular puntaje y enviar
    const puntaje = calcularPuntaje();
    console.log("Datos del formulario:", formData);
    console.log("Invitados adicionales:", invitadosAdicionales);
    console.log("Puntaje del quiz:", puntaje, "de", quiz.questions.length);

    alert(
      `¡Confirmación enviada! Obtuviste ${puntaje} de ${quiz.questions.length} puntos en el quiz.`,
    );

    // Scroll suave al top y reiniciar formulario
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      // Reiniciar todos los estados
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
  };

  const preguntaQuiz = quiz.questions[preguntaActual];
  const esUltimaPregunta = preguntaActual === quiz.questions.length - 1;

  return (
    <div
      className="relative flex flex-col justify-center items-center min-h-[85vh] bg-cover bg-center bg-no-repeat px-4 py-4"
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
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
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
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
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
                    value={formData.asistencia}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                  >
                    <option value="">Selecciona una</option>
                    <option value="si">Sí, asistiré</option>
                    <option value="no">No podré asistir</option>
                  </select>
                </div>

                {/* Cantidad de personas (solo si confirma asistencia) */}
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
                        value={formData.cantidadPersonas}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
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
                        {invitadosAdicionales.map((invitado, index) => (
                          <div
                            key={index}
                            className="mb-4 p-3 bg-white rounded-md"
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
                                  value={invitado.nombre}
                                  onChange={(e) =>
                                    handleInvitadoChange(
                                      index,
                                      "nombre",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm"
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
                                  value={invitado.apellido}
                                  onChange={(e) =>
                                    handleInvitadoChange(
                                      index,
                                      "apellido",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm"
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
                                      checked={invitado.esMenor === true}
                                      onChange={() =>
                                        handleEdadChange(index, true)
                                      }
                                      className="w-4 h-4 text-blue-950 border-gray-300 focus:ring-2 focus:ring-blue-950"
                                    />
                                    <label
                                      htmlFor={`invitado-menor-${index}`}
                                      className="text-xs font-medium text-gray-700"
                                    >
                                      Es menor de 12 años
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      id={`invitado-mayor-${index}`}
                                      name={`edad-${index}`}
                                      checked={invitado.esMenor === false}
                                      onChange={() =>
                                        handleEdadChange(index, false)
                                      }
                                      className="w-4 h-4 text-blue-950 border-gray-300 focus:ring-2 focus:ring-blue-950"
                                    />
                                    <label
                                      htmlFor={`invitado-mayor-${index}`}
                                      className="text-xs font-medium text-gray-700"
                                    >
                                      Es mayor de 12 años
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
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
                        placeholder="Ej: vegetariano, celíaco, alérgico a..."
                        value={formData.restriccionesAlimentarias}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Déjanos saber si tienes alguna restricción alimentaria
                      </p>
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
                        placeholder="Escribe un mensaje especial..."
                        value={formData.mensaje}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Botón de envío */}
                <button
                  type="submit"
                  className="w-full bg-blue-950 text-white py-3 px-4 rounded-md font-semibold uppercase tracking-wide hover:bg-blue-900 transition-colors duration-200"
                >
                  Confirmar
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
                  Ahora unas preguntas sobre mí, ¡y si contestas todas bien, hay
                  premio!
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
                          checked={respuestasQuiz[preguntaQuiz.id] === index}
                          onChange={() =>
                            handleRespuestaQuiz(preguntaQuiz.id, index)
                          }
                          className="w-5 h-5 text-blue-950 border-gray-300 focus:ring-2 focus:ring-blue-950"
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

              {/* Botón finalizar (solo en la última pregunta y si está respondida) */}
              {esUltimaPregunta &&
                respuestasQuiz[preguntaQuiz.id] !== undefined && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleFinalizarQuiz}
                    className="w-full bg-blue-950 text-white py-3 px-4 rounded-md font-semibold uppercase tracking-wide hover:bg-blue-900 transition-colors duration-200"
                  >
                    Finalizar Quiz
                  </motion.button>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
