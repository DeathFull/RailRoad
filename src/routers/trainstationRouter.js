import express from "express";
import TrainstationRepository from "../repositories/TrainstationRepository.js";
import { tokenMiddleware } from "../middlewares/tokenMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import TrainRepository from "../repositories/trainRepository.js";
import { objectIdMiddleware } from "../middlewares/objectIdMiddleware.js";
import sharp from "sharp";

const router = express.Router();

router.get("/", async (req, res) => {
  const { order } = req.query;
  const orderByList = [1, -1];
  const trainstations = await TrainstationRepository.listTrainstations(
    !Number.isNaN(order) && order in orderByList ? order : 1,
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

router.get("/:id/image", objectIdMiddleware, async (req, res) => {
  const { id } = req.params;

  const trainstation = await TrainstationRepository.getTrainstationById(id);

  if (!trainstation) {
    return res.status(404).send("Trainstation not found");
  }

  const image = await sharp(Buffer.from(trainstation.image, "base64"))
    .png()
    .toBuffer();

  res.status(200).type("png").send(image);
});

router.post("/", tokenMiddleware, adminMiddleware, async (req, res) => {
  const trainPayload = req.body;
  const image = sharp(
    Buffer.from(
      trainPayload.image.toString().replace(/^data:image\/\w+;base64,/, ""),
      "base64",
    ),
  );
  let meta = null;
  try {
    meta = await image.metadata();
  } catch (_) {
    return res.status(400).send("Invalid image");
  }
  if (meta.width > 200 || meta.height > 200) {
    trainPayload.image = (await image.resize(200, 200).toBuffer()).toString(
      "base64",
    );
  }

  const trainstation =
    await TrainstationRepository.createTrainstation(trainPayload);

  res.status(201).json(trainstation);
});

router.put(
  "/:id",
  tokenMiddleware,
  adminMiddleware,
  objectIdMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const trainPayload = req.body;
    const image = sharp(
      Buffer.from(
        trainPayload.image.toString().replace(/^data:image\/\w+;base64,/, ""),
        "base64",
      ),
    );
    let meta = null;
    try {
      meta = await image.metadata();
    } catch (_) {
      return res.status(400).send("Invalid image");
    }
    if (meta.width > 200 || meta.height > 200) {
      trainPayload.image = (await image.resize(200, 200).toBuffer()).toString(
        "base64",
      );
    }
    await TrainstationRepository.updateTrainstation(id, trainPayload);
    res.json(trainPayload);
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
