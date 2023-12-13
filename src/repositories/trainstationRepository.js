import { TrainstationModel } from "../models/TrainstationModel.js";

class TrainstationRepository {
  async listTrainstations() {
    return await TrainstationModel.find();
  }

  async createTrainstation(trainstationPayload) {
    return await TrainstationModel.create(trainstationPayload);
  }

  async getTrainstationById(id) {
    return await TrainstationModel.findById(id);
  }

  async updateTrainstation(id, payload) {
    const newTrainstation = await TrainstationModel.findOneAndUpdate(
      {
        _id: id,
      },
      payload,
    );

    return newTrainstation;
  }

  async deleteTrainstation(id) {
    await TrainstationModel.deleteOne({ _id: id });
  }
}

export default new TrainstationRepository();
