import express from "express";
import TrainstationRepository from "../repositories/TrainstationRepository.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { trainstation } = req.query;

  const trainstations = await TrainstationRepository.listTrainstations({});

  res.json(trainstations);
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const trainstation = await TrainstationRepository.getTrainstationById(id);

    if (!trainstation) {
      return res.status(404).send("Trainstation not found");
    }

    res.json(trainstation);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

router.post("/", async (req, res) => {
  const trainstation = await TrainstationRepository.createTrainstation(
    req.body,
  );
  console.log("Trainstation created");

  res.status(201).json(trainstation);
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await TrainstationRepository.updateTrainstation(id, req.body);
    console.log("Trainstation updated");
    res.json(req.body);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

router.delete("/:id", async (req, res) => {
  await TrainstationRepository.deleteTrainstation(req.params.id);
  console.log("Trainstation deleted");
  res.status(204).send();
});

export default router;