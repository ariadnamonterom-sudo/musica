import express from "express";
import cors from "cors";
import { logger } from "./middleware/logger.js";
import musicaRouter from "./routes/musica.routes.js";

const app = express();
const PRODUCCION = process.env.NODE_ENV === "production";

const origenes = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:4173"];

app.use(cors({ origin: origenes }));
app.use(express.json());
app.use(logger);


app.get("/", (req, res) => {
  res.json({ estado: "ok", servicio: "api-musica" });
});

app.use("/api", musicaRouter);


app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: PRODUCCION ? "Error interno del servidor" : err.message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
