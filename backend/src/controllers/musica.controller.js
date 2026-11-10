import prisma from "../lib/prisma.js";


export async function listarArtistas(req, res) {
  try {
    const artistas = await prisma.artista.findMany({
      orderBy: { id: "asc" }
    });
    res.json(artistas);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener los artistas" });
  }
}

export async function crearArtista(req, res) {
  try {
    const { nombre, genero } = req.body;
    
    if (!nombre || !genero) {
      return res.status(400).json({ error: "El nombre y el género son obligatorios" });
    }

    const artista = await prisma.artista.create({
      data: { 
        nombre: nombre.trim(), 
        genero: genero.trim() 
      }
    });
    res.status(201).json(artista);
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear el artista" });
  }
}

export async function obtenerCancionesDeArtista(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id del artista debe ser un número entero" });
    }

    const artista = await prisma.artista.findUnique({
      where: { id },
      include: { canciones: true }
    });

    if (!artista) {
      return res.status(404).json({ error: "Artista no encontrado" });
    }

    res.json(artista.canciones);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener las canciones del artista" });
  }
}


export async function listarCanciones(req, res) {
  try {
    const { favorita } = req.query;
    let filtro = {};

    if (favorita !== undefined) {
      filtro.favorita = favorita === "true";
    }

    const canciones = await prisma.cancion.findMany({
      where: filtro,
      include: { artista: true },
      orderBy: { id: "asc" }
    });
    res.json(canciones);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener las canciones" });
  }
}

export async function obtenerCancion(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un número entero" });
    }

    const cancion = await prisma.cancion.findUnique({
      where: { id },
      include: { artista: true }
    });

    if (!cancion) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    res.json(cancion);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener la canción" });
  }
}

export async function crearCancion(req, res) {
  try {
    const { titulo, duracion, favorita, artistaId } = req.body;
    
    const artistaExiste = await prisma.artista.findUnique({ 
      where: { id: artistaId } 
    });
    
    if (!artistaExiste) {
      return res.status(404).json({ error: "El artista asociado no existe" });
    }

    const cancion = await prisma.cancion.create({
      data: {
        titulo: titulo.trim(),
        duracion,
        favorita: favorita ?? false,
        artistaId
      },
      include: { artista: true }
    });

    res.status(201).json(cancion);
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear la canción" });
  }
}

export async function actualizarCancion(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un número entero" });
    }

    const existente = await prisma.cancion.findUnique({ where: { id } });
    if (!existente) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    const { titulo, duracion, favorita, artistaId } = req.body;
    const datos = {};

    if (titulo !== undefined) {
      if (typeof titulo !== "string" || titulo.trim().length < 1) {
        return res.status(400).json({ error: "El título debe tener al menos 1 carácter" });
      }
      datos.titulo = titulo.trim();
    }

    if (duracion !== undefined) {
      if (typeof duracion !== "number" || duracion <= 0) {
        return res.status(400).json({ error: "La duración debe ser un número mayor a 0" });
      }
      datos.duracion = duracion;
    }

    if (favorita !== undefined) {
      if (typeof favorita !== "boolean") {
        return res.status(400).json({ error: "favorita debe ser true o false" });
      }
      datos.favorita = favorita;
    }

    if (artistaId !== undefined) {
      if (typeof artistaId !== "number" || !Number.isInteger(artistaId)) {
        return res.status(400).json({ error: "El artistaId debe ser un número entero" });
      }
      const artistaExiste = await prisma.artista.findUnique({ where: { id: artistaId } });
      if (!artistaExiste) {
        return res.status(404).json({ error: "El artista asociado no existe" });
      }
      datos.artistaId = artistaId;
    }

    const cancionActualizada = await prisma.cancion.update({
      where: { id },
      data: datos,
      include: { artista: true }
    });

    res.json(cancionActualizada);
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar la canción" });
  }
}

export async function eliminarCancion(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un número entero" });
    }

    const existente = await prisma.cancion.findUnique({ where: { id } });
    if (!existente) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    await prisma.cancion.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar la canción" });
  }
}
