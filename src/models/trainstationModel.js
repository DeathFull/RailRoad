import mongoose from "mongoose";

const TrainstationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  open_hour: { type: String, required: true },
  close_hour: { type: String, required: true },
  image: { type: String, required: true },
});

export const TrainstationModel = mongoose.model(
  "Trainstation",
  TrainstationSchema,
);
