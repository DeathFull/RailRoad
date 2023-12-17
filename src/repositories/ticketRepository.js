import { TicketModel } from "../models/TicketModel.js";

class TicketRepository {
  async createTicket(ticketPayload) {
    return await TicketModel.create(ticketPayload);
  }

  async getTicketById(id) {
    return await TicketModel.findById(id);
  }

  async getTicketByPayload(payload) {
    return await TicketModel.findOne(payload);
  }

  async updateTicket(id, payload) {
    return await TicketModel.findOneAndUpdate(
      {
        _id: id,
      },
      payload,
    );
  }

  async deleteTicketByTrain(id) {
    await TicketModel.deleteMany({ train: id });
  }

  async deleteTicketByUser(id) {
    await TicketModel.deleteMany({ user: id });
  }
}

export default new TicketRepository();
