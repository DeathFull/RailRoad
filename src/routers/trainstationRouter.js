import express from "express";
import TrainstationRepository from "../repositories/TrainstationRepository.js";
import { tokenMiddleware } from "../middlewares/tokenMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import TrainRepository from "../repositories/trainRepository.js";
import { objectIdMiddleware } from "../middlewares/objectIdMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { order } = req.query;
  const orderByList = [1, -1];
  const trainstations = await TrainstationRepository.listTrainstations(
    !Number.isNaN(order) && order in orderByList ? order : order,
  );

  res.json(trainstations);
});

router.get("/:id", objectIdMiddleware, async (req, res) => {
  const { id } = req.params;

  const trainstation = await TrainstationRepository.getTrainstationById(id);

  if (!trainstation) {
    return res.status(404).send("Trainstation not found");
  }

  res.json(trainstation);
});

router.post("/", tokenMiddleware, adminMiddleware, async (req, res) => {
  const trainstation = await TrainstationRepository.createTrainstation(
    req.body,
  );

  res.status(201).json(trainstation);
});

router.put(
  "/:id",
  tokenMiddleware,
  adminMiddleware,
  objectIdMiddleware,
  async (req, res) => {
    const { id } = req.params;
    await TrainstationRepository.updateTrainstation(id, req.body);
    res.json(req.body);
  },
);

router.delete(
  "/:id",
  tokenMiddleware,
  adminMiddleware,
  objectIdMiddleware,
  async (req, res) => {
    const { id } = req.params;
    if (!(await TrainstationRepository.getTrainstationById(id))) {
      return res.status(404).send("Trainstation not found");
    }

    await TrainRepository.deleteManyTrainByStation(id);
    await TrainstationRepository.deleteTrainstation(id);
    res.status(204).send();
  },
);

export default router;
