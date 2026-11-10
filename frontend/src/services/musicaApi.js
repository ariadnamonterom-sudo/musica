
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const API_BASE = `${API_BASE_URL}/api`;

function obtenerApiKey() {
  return sessionStorage.getItem("apiKey") ?? "";
}

async function peticion(url, opciones, mensajeError) {
  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch {
    throw new Error("No se puede conectar con el servidor. ¿Está arrancado el Backend de música?" );
  }

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}));
    throw new Error(
      cuerpo.error ?? `${mensajeError} (código ${respuesta.status})`
    );
  }

  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : null;
}

function cabecerasProtegidas() {
  return { 
    "Content-Type": "application/json", 
    "x-api-key": obtenerApiKey() 
  };
}



export function obtenerArtistas() {
  return peticion(`${API_BASE}/artistas`, undefined, "No se pudieron cargar los artistas");
}


export function crearArtista(datos) {
  return peticion(
    `${API_BASE}/artistas`,
    {
      method: "POST",
      headers: cabecerasProtegidas(),
      body: JSON.stringify(datos),
    },
    "No se pudo registrar al artista en el catálogo"
  );
}



export function obtenerCancionesPorArtista(artistaId) {
  return peticion(`${API_BASE}/artistas/${artistaId}/canciones`, undefined, "No se pudieron obtener las canciones de este artista");
}

export function crearCancion(datos) {
  return peticion(
    `${API_BASE}/canciones`,
    {
      method: "POST",
      headers: cabecerasProtegidas(),
      body: JSON.stringify(datos),
    },
    "No se pudo registrar la canción en el catálogo"
  );
}

export function modificarCancion(id, cambios) {
  return peticion(
    `${API_BASE}/canciones/${id}`,
    {
      method: "PATCH",
      headers: cabecerasProtegidas(),
      body: JSON.stringify(cambios),
    },
    "No se pudo modificar la canción"
  );
}

export function eliminarCancion(id) {
  return peticion(
    `${API_BASE}/canciones/${id}`,
    { 
      method: "DELETE", 
      headers: { "x-api-key": obtenerApiKey() } 
    },
    "No se pudo eliminar la canción"
  );
}
