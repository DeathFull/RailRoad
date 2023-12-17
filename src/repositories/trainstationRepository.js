import { TrainstationModel } from "../models/TrainstationModel.js";

class TrainstationRepository {
  async listTrainstations(order = 1) {
    return await TrainstationModel.find().sort({ name: Number(order) });
  }

  async createTrainstation(trainstationPayload) {
    return await TrainstationModel.create(trainstationPayload);
  }

  async getTrainstationById(id) {
    return await TrainstationModel.findById(id);
  }

  async updateTrainstation(id, payload) {
    return await TrainstationModel.findOneAndUpdate(
      {
        _id: id,
      },
      payload,
    );
  }

  async deleteTrainstation(id) {
    await TrainstationModel.findOneAndDelete({ _id: id });
  }
}

export default new TrainstationRepository();
