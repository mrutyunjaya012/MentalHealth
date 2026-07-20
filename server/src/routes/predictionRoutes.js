import { Router } from "express";
import {
  getPredictions,
  getPredictionsByUser,
  getPredictionById,
  createPrediction,
  updatePrediction,
  deletePrediction,
} from "../controllers/predictionController.js";

const router = Router();

router.get("/", getPredictions);
router.get("/user/:email", getPredictionsByUser);
router.get("/:id", getPredictionById);
router.post("/", createPrediction);
router.patch("/:id", updatePrediction);
router.delete("/:id", deletePrediction);

export default router;
