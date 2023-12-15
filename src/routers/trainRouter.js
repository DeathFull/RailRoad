import express from "express";
import TrainRepository from "../repositories/TrainRepository.js";
import mongoose from "mongoose";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { tokenMiddleware } from "../middlewares/tokenMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { limit, sortBy, order } = req.query;
  const sortByList = ["start_station", "end_station", "time_of_departure"];
  const trains = await TrainRepository.listTrains(
    !Number.isNaN(limit) ? limit : 10,
    sortBy in sortByList ? sortBy : "time_of_departure",
    !Number.isNaN(order) ? order : 1,
  );

  res.json(trains);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ObjectId");
  }

  const train = await TrainRepository.getTrainById(id);
  if (!train) return res.status(404).send("Train not found");
  res.json(train);
});

router.post("/", tokenMiddleware, adminMiddleware, async (req, res) => {
  const train = await TrainRepository.createTrain(req.body);
  console.log("Train created");

  res.status(201).json(train);
});

router.put("/:id", tokenMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await TrainRepository.updateTrain(id, req.body);
    console.log("Train updated");
    res.json(req.body);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

router.delete("/:id", tokenMiddleware, adminMiddleware, async (req, res) => {
  await TrainRepository.deleteTrain(req.params.id);
  console.log("Train deleted");
  res.status(204).send();
});

export default router;
