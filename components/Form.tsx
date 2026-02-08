"use client";

import { useState } from "react";

interface Invitado {
  nombre: string;
  apellido: string;
}

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
      const adicionales = cantidad - 1; // -1 porque el primero ya tiene sus datos

      if (adicionales > 0) {
        setInvitadosAdicionales(
          Array.from(
            { length: adicionales },
            (_, i) => invitadosAdicionales[i] || { nombre: "", apellido: "" },
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
    value: string,
  ) => {
    setInvitadosAdicionales((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    console.log("Invitados adicionales:", invitadosAdicionales);
    // Aquí conectarías con tu backend o servicio
    alert("¡Confirmación enviada! Gracias por responder.");
  };

  return (
    <div
      className="relative flex flex-col justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat px-4 py-6"
      style={{ backgroundImage: `url('/fondo15.png')` }}
    >
      <div className="absolute inset-0 bg-black/65"></div>

      <div className="max-w-md mx-auto rounded-lg shadow-md p-6 sm:p-8 bg-slate-200 relative z-10">
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
                    <div key={index} className="mb-4 p-3 bg-white rounded-md">
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
            Enviar Confirmación
          </button>
        </form>
      </div>
    </div>
  );
}
