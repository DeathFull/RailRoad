import express from "express";
import TrainRepository from "../repositories/TrainRepository.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { tokenMiddleware } from "../middlewares/tokenMiddleware.js";
import { objectIdMiddleware } from "../middlewares/objectIdMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { limit, sortBy, order } = req.query;
  const sortByList = ["start_station", "end_station", "time_of_departure"];
  const orderByList = [1, -1];
  const trains = await TrainRepository.listTrains(
    !Number.isNaN(limit) ? limit : 10,
    sortBy in sortByList ? sortBy : "time_of_departure",
    !Number.isNaN(order) && order in orderByList ? order : 1,
  );

  res.json(trains);
});

router.get("/:id", objectIdMiddleware, async (req, res) => {
  const { id } = req.params;

  const train = await TrainRepository.getTrainById(id);
  if (!train) return res.status(404).send("Train not found");
  res.json(train);
});

router.post("/", tokenMiddleware, adminMiddleware, async (req, res) => {
  const train = await TrainRepository.createTrain(req.body);
  res.status(201).json(train);
});

router.put(
  "/:id",
  tokenMiddleware,
  adminMiddleware,
  objectIdMiddleware,
  async (req, res) => {
    const { id } = req.params;
    await TrainRepository.updateTrain(id, req.body);
    res.json(req.body);
  },
);

router.delete(
  "/:id",
  tokenMiddleware,
  adminMiddleware,
  objectIdMiddleware,
  async (req, res) => {
    await TrainRepository.deleteTrain(req.params.id);
    res.status(204).send();
  },
);

export default router;
