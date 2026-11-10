import express from "express";
import cors from "cors"
import { logger } from "./middleware/logger.js";
import musicaRouter from "./routes/musica.routes.js"; 


const app = express();
const PORT = 3000;

app.use(
  cors({ origin: ["http://localhost:5173", "http://localhost:4173"] })
);
app.use(express.json()); 
app.use(logger);    



app.use("/api", musicaRouter); 


app.get("/", (req, res) => {
  res.json({
    nombre: "API de Música y Artistas",
    estado: "funcionando"
  });
});


app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
