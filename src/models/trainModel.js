import mongoose, { Schema } from "mongoose";

const TrainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  start_station: {
    type: Schema.Types.ObjectId,
    ref: "Trainstation",
    required: true,
  },
  end_station: {
    type: Schema.Types.ObjectId,
    ref: "Trainstation",
    required: true,
  },
  time_of_departure: { type: Date, required: true },
});

export const TrainModel =
  mongoose.models.Train || mongoose.model("Train", TrainSchema);
