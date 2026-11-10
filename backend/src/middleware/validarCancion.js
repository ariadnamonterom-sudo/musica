export function validarCancion(req, res, next) {
  const { titulo, duracion, artistaId } = req.body;
  if (typeof titulo !== "string" || titulo.trim().length < 1) {
    return res.status(400).json({ error: "El título es obligatorio y debe tener al menos 1 caracter" });
  }
  if (typeof duracion !== "number" || duracion <= 0) {
    return res.status(400).json({ error: "La duración debe ser un número mayor a 0" });
  }
  if (!Number.isInteger(artistaId)) {
    return res.status(400).json({ error: "El artistaId debe ser un número entero válido" });
  }
  next();
}