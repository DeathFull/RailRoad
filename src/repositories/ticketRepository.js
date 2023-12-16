import { TicketModel } from "../models/TicketModel.js";

class TicketRepository {
  async createTicket(ticketPayload) {
    return await TicketModel.create(ticketPayload);
  }

  async getTicketById(id) {
    return await TicketModel.findById(id);
  }

  async updateTicket(id, payload) {
    const newTicket = await TicketModel.findOneAndUpdate(
      {
        _id: id,
      },
      payload,
    );

    return newTicket;
  }
}

export default new TicketRepository();
