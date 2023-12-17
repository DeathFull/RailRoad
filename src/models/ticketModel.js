import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  train: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Train",
  },
  isValidated: { type: Boolean, required: true },
});
export const TicketModel = mongoose.model("Ticket", TicketSchema);
