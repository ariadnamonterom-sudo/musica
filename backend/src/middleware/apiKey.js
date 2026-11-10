import "dotenv/config";

export function comprobarApiKey(req, res, next) {
  const apiKey = req.header("x-api-key");

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      error: "Clave de API incorrecta o ausente"
    });
  }

  next();
}