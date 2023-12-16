import express from "express";
import ticketRepository from "../repositories/TicketRepository.js";
import { tokenMiddleware } from "../middlewares/tokenMiddleware.js";
import { employeeMiddleware } from "../middlewares/employeeMiddleware.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await ticketRepository.getTicketById(id);

    if (!ticket) {
      return res.status(404).send("Ticket not found");
    } else if (ticket.isValidated) {
      // res.json(ticket);
      return res.status(200).send(true);
    } else {
      // res.json(ticket);
      return res.status(200).send(false);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

router.post("/", tokenMiddleware, employeeMiddleware, async (req, res) => {
  const ticket = await ticketRepository.createTicket(req.body);
  console.log("Ticket created");

  res.status(201).json(ticket);
});

router.put("/:id", tokenMiddleware, employeeMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await ticketRepository.updateTicket(id, req.body);
    console.log("Ticket updated");
    res.json(req.body);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

export default router;
