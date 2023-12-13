import { TrainModel } from "../models/TrainModel.js";

class TrainRepository {
  async listTrains() {
    return await TrainModel.find();
  }

  async createTrain(trainPayload) {
    return await TrainModel.create(trainPayload);
  }

  async getTrainById(id) {
    return await TrainModel.findById(id);
  }

  async updateTrain(id, payload) {
    const newTrain = await TrainModel.findOneAndUpdate(
      {
        _id: id,
      },
      payload,
    );

    return newTrain;
  }

  async deleteTrain(id) {
    await TrainModel.deleteOne({ _id: id });
  }
}

export default new TrainRepository();
