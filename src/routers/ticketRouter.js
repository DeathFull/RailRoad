import express from "express";
import ticketRepository from "../repositories/TicketRepository.js";
import { tokenMiddleware } from "../middlewares/tokenMiddleware.js";
import { employeeMiddleware } from "../middlewares/employeeMiddleware.js";
import { objectIdMiddleware } from "../middlewares/objectIdMiddleware.js";

const router = express.Router();

router.get("/:id", objectIdMiddleware, async (req, res) => {
  const { id } = req.params;

  const ticket = await ticketRepository.getTicketById(id);

  if (!ticket) {
    return res.status(404).send("Ticket not found");
  }

  if (ticket.isValidated) {
    return res.status(200).json({ isValid: ticket.isValidated });
  }
});

router.post("/", tokenMiddleware, employeeMiddleware, async (req, res) => {
  const ticket = await ticketRepository.createTicket(req.body);

  res.status(201).json(ticket);
});

router.put(
  "/:id",
  tokenMiddleware,
  employeeMiddleware,
  objectIdMiddleware,
  async (req, res) => {
    const { id } = req.params;
    await ticketRepository.updateTicket(id, req.body);
    res.json(req.body);
  },
);

export default router;
