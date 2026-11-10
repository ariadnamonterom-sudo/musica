import { useState } from "react";

function FormularioCancion({ onCrear }) {
  const [titulo, setTitulo] = useState("");
  const [duracion, setDuracion] = useState("");
  const [anio, setAnio] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function manejarSubmit(evento) {
    evento.preventDefault(); 
    setEnviando(true);

   
    const datosCancion = {
      titulo: titulo.trim(),
      duracion: Number(duracion), 
      anio: anio ? Number(anio) : undefined, 
      favorita: false 
    };

    const guardadoExitoso = await onCrear(datosCancion);
    setEnviando(false);

    
    if (guardadoExitoso) {
      setTitulo("");
      setDuracion("");
      setAnio("");
    }
  }

  return (
    <form onSubmit={manejarSubmit} className="tarjeta-formulario">
      <h2>Nueva Canción</h2>
      
      <label>
        Título
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)} 
          required
          minLength={3}
          placeholder="Ej. BAGDAD"
        />
      </label>

      <label>
        Duración (en segundos)
        <input
          type="number"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
          required
          min={1}
          placeholder="Ej. 180"
        />
      </label>

      <label>
        Año de lanzamiento (opcional)
        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          min={1900}
          max={new Date().getFullYear()}
          placeholder="Ej. 2018"
                />
      </label>

      <button type="submit" disabled={enviando}>
        {enviando ? "Registrando..." : "Crear canción"}
      </button>
    </form>
  );
}

export default FormularioCancion;
