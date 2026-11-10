import { Router } from "express";
import {

  listarArtistas,
  crearArtista,
  obtenerCancionesDeArtista,
  listarCanciones,
  obtenerCancion,
  crearCancion,
  actualizarCancion,
  eliminarCancion
} from "../controllers/musica.controller.js"; 
import { validarCancion } from "../middleware/validarCancion.js";
import { comprobarApiKey } from "../middleware/apiKey.js";

const router = Router();

router.get("/artistas", listarArtistas);
router.get("/artistas/:id/canciones", obtenerCancionesDeArtista);
router.post("/artistas", comprobarApiKey, crearArtista); 
router.get("/canciones", listarCanciones);
router.get("/canciones/:id", obtenerCancion);
router.post("/canciones", comprobarApiKey, validarCancion, crearCancion); 
router.patch("/canciones/:id", comprobarApiKey, actualizarCancion);       
router.delete("/canciones/:id", comprobarApiKey, eliminarCancion);       

export default router;
