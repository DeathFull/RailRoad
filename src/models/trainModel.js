import mongoose from "mongoose";

const TrainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  start_station: { type: String, required: true },
  end_station: { type: String, required: true },
  time_of_departure: { type: Date, required: true },
});
export const TrainModel = mongoose.model("Train", TrainSchema);
