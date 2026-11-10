// src/App.jsx
import { useCallback, useEffect, useState } from "react";
import { obtenerArtistas, obtenerCancionesPorArtista, crearCancion, modificarCancion, eliminarCancion, crearArtista } from "./services/musicaApi"; 
import CancionItem from "./components/CancionItem.jsx";
import FormularioCancion from "./components/FormularioCancion.jsx";
import FormularioArtista from "./components/FormularioArtista.jsx";

function App() {
  const [artistas, setArtistas] = useState([]);
  const [artistaSeleccionado, setArtistaSeleccionado] = useState(null); 
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [aviso, setAviso] = useState(null);
  const [canciones, setCanciones] = useState([]);
  const [apiKey, setApiKey] = useState(
    () => sessionStorage.getItem("apiKey") ?? ""
  );

  const cargarCatálogo = useCallback(async () => {
    try {
      setErrorCarga("");
      const datosArtistas = await obtenerArtistas();
      setArtistas(datosArtistas);
      if (datosArtistas.length > 0) {
        setArtistaSeleccionado(datosArtistas[0]);
      }
    } catch (err) {
      setErrorCarga(err.message);
    }
  }, []);

  useEffect(() => {
    cargarCatálogo().finally(() => setCargando(false));
  }, [cargarCatálogo]);

 
  useEffect(() => {
    if (!artistaSeleccionado) return;
    let activo = true;

    async function cargarCancionesDelArtista() {
      try {
        const datosCanciones = await obtenerCancionesPorArtista(artistaSeleccionado.id);
        if (activo) setCanciones(datosCanciones);
      } catch (err) {
        if (activo) mostrarAviso("error", `No se pudieron sincronizar las canciones: ${err.message}`);
      }
    }

    cargarCancionesDelArtista();
    return () => { activo = false; }; 
  }, [artistaSeleccionado]);

  function reintentar() {
    setCargando(true);
    cargarCatálogo().finally(() => setCargando(false));
  }

  function mostrarAviso(tipo, texto) {
    setAviso({ tipo, texto });
  }

  function guardarApiKey() {
    sessionStorage.setItem("apiKey", apiKey);
    mostrarAviso("ok", "Clave de catálogo guardada con éxito para esta sesión");
  }

  async function manejarCrearArtista(datosArtistas) {
    try {
      const artistaCreado = await crearArtista(datosArtistas);
      setArtistas((actuales) => {
        const nuevaLista = [...actuales, artistaCreado];
        setArtistaSeleccionado(artistaCreado);
        return nuevaLista;
      });
      mostrarAviso("ok", `Artista "${artistaCreado.nombre}" añadido al catálogo`);
      return true;
    } catch (err) {
      mostrarAviso("error", err.message);
      return false;
    }
  }

  async function manejarCrear(datosNuevos) {
    try {
      if (!artistaSeleccionado) 
        throw new Error("Debes seleccionar un artista primero");
      const cuerpoConArtista = { ...datosNuevos, artistaId: Number(artistaSeleccionado.id) };
      const cancionCreada = await crearCancion(cuerpoConArtista); 
      setCanciones((actuales) => [...actuales, cancionCreada]);
      mostrarAviso("ok", `Canción "${cancionCreada.titulo}" añadida al catálogo`);
      return true; 
    } catch (err) {
      mostrarAviso("error", err.message);
      return false; 
    }
  }

  async function manejarCambiarEstado(cancion) {
    const cambios = { favorita: !cancion.favorita };
    try {
      const actualizada = await modificarCancion(cancion.id, cambios);
      setCanciones((actuales) =>
        actuales.map((c) => (c.id === cancion.id ? { ...c, ...cambios, ...actualizada } : c))
      );
      mostrarAviso("ok", `Preferencia de "${cancion.titulo}" actualizada`);
    } catch (err) {
      mostrarAviso("error", err.message);
    }
  }

  async function manejarEliminar(id) {
    if (!window.confirm("¿Seguro que deseas eliminar esta canción?")) return;
    try {
      await eliminarCancion(id);
      setCanciones((actuales) => actuales.filter((c) => c.id !== id));
      mostrarAviso("ok", "Canción eliminada correctamente del servidor");
    } catch (err) {
      mostrarAviso("error", err.message);
    }
  }

  return (
    <main>
      <h1>Catálogo Musical</h1>
      
      {!cargando && !errorCarga && (
        <section className="caja-sesion">
          <h2>Acceso a operaciones protegidas</h2>
          <div className="sesion-inputs">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Escribe tu x-api-key"
            />
            <button onClick={guardarApiKey}>Guardar en sesión</button>
          </div>
        </section>
      )}

      {cargando && <p>Cargando catálogo desde el servidor...</p>}

      {!cargando && errorCarga && (
        <div role="alert" className="aviso aviso-error">
          <p><strong>Error de comunicación:</strong> {errorCarga}</p>
          <button onClick={reintentar}>Reintentar conexión</button>
        </div>
      )}

      {!cargando && !errorCarga && (
        <>
          <section className="caja-selector">
            <label>
              <strong>Filtrar catálogo por Artista:</strong>
              <select
                value={artistaSeleccionado?.id ?? ""}
                onChange={(e) => {
                  const idBuscado = Number(e.target.value);
                  setArtistaSeleccionado(artistas.find((a) => a.id === idBuscado));
                }}
                className="selector-desplegable"
              >
                {artistas.map((artista) => (
                  <option key={artista.id} value={artista.id}>
                    {artista.nombre} — {artista.genero ?? "Género no definido"}
                  </option>
                ))}
              </select>
            </label>
          </section>

          {aviso && (
            <p className={`aviso aviso-${aviso.tipo}`} role="status">
              {aviso.texto}
            </p>
          )}

          <div className="rejilla-formularios">
            <FormularioArtista onArtistaCreado={manejarCrearArtista} />
            <FormularioCancion onCrear={manejarCrear} />
          </div>

          <section className="seccion-listado">
            <h2>Canciones registradas de {artistaSeleccionado?.nombre} ({canciones.length})</h2>
            
            {canciones.length === 0 && <p>No hay canciones en este catálogo para este artista en este momento.</p>}

            <div className="rejilla-canciones">
              {canciones.map((cancion) => (
                <CancionItem
                  key={cancion.id}
                  cancion={cancion}
                  onCambiarEstado={manejarCambiarEstado}
                  onEliminar={manejarEliminar}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default App;
