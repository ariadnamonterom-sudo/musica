function CancionItem({ cancion, onCambiarEstado, onEliminar }) {
  
  
  function formatearDuracion(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes.toString().padStart(2, "0")} min`;
  }

  return (
    <article>
      <h3>{cancion.titulo}</h3>
      <p>Duración: {formatearDuracion(cancion.duracion)}</p>
      {cancion.anio && <p>Año de lanzamiento: {cancion.anio}</p>}
      <p>Preferencia: {cancion.favorita ? "⭐ Favorita" : "🎵 Normal"}</p>
      
      <button onClick={() => onCambiarEstado(cancion)}>
        {cancion.favorita ? "Quitar de Favoritas" : "Marcar como Favorita"}
      </button>

      <button onClick={() => onEliminar(cancion.id)} style={{ marginLeft: "8px" }}>
        Eliminar canción
      </button>
    </article>
  );
}

export default CancionItem;
