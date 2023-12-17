import express from "express";
import ticketRepository from "../repositories/TicketRepository.js";
import { tokenMiddleware } from "../middlewares/tokenMiddleware.js";
import { employeeMiddleware } from "../middlewares/employeeMiddleware.js";
import { objectIdMiddleware } from "../middlewares/objectIdMiddleware.js";
import { Types } from "mongoose";

const router = express.Router();

router.get("/:id", objectIdMiddleware, async (req, res) => {
  const { id } = req.params;

  const ticket = await ticketRepository.getTicketById(id);

  if (!ticket) {
    return res.status(404).send("Ticket not found");
  }

  return res.status(200).json(ticket);
});

router.get(
  "/validate",
  tokenMiddleware,
  employeeMiddleware,
  async (req, res) => {
    const { trainId, userId } = req.body;

    if (!trainId || !userId) {
      return res.status(400).send("Train ID and Ticket ID are required");
    }

    if (!Types.ObjectId.isValid(trainId) || !Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Train ID and Ticket ID must be valid");
    }

    const ticket = await ticketRepository.getTicketByPayload({
      user: userId,
      train: trainId,
    });

    res.status(200).json({ isValid: Boolean(ticket) });
  },
);

router.post("/", tokenMiddleware, employeeMiddleware, async (req, res) => {
  const ticket = await ticketRepository.createTicket(req.body);

  res.status(201).json(ticket);
});

export default router;
