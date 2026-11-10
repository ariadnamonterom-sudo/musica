// src/components/FormularioArtista.jsx
import { useState } from "react";

function FormularioArtista({ onArtistaCreado }) {
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setEnviando(true);

    const datosArtista = {
      nombre: nombre.trim(),
      genero: genero.trim() || undefined
    };

    const exito = await onArtistaCreado(datosArtista);
    setEnviando(false);

    if (exito) {
      setNombre("");
      setGenero("");
    }
  }

  return (
    <form onSubmit={manejarSubmit} className="tarjeta-formulario">
      <h2>Nuevo Artista</h2>
      
      <label>
        Nombre del Artista / Banda
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          placeholder="Ej. Rosalía, Coldplay"
        />
      </label>

      <label>
        Género Musical
        <input
          type="text"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          placeholder="Ej. Pop, Flamenco urbano"
        />
      </label>

      <button type="submit" disabled={enviando || !nombre}>
        {enviando ? "Guardando artista..." : "Registrar Artista"}
      </button>
    </form>
  );
}

export default FormularioArtista;
