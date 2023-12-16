import { TrainModel } from "../models/TrainModel.js";

class TrainRepository {
  async listTrains(limit = 10, sortBy = "time_of_departure", order = 1) {
    const sortOptions = [[sortBy, Number(order)]];
    return TrainModel.find({})
      .sort(sortOptions)
      .populate("start_station")
      .populate("end_station")
      .limit(limit);
  }

  async createTrain(trainPayload) {
    return await TrainModel.create(trainPayload);
  }

  async getTrainById(id) {
    return await TrainModel.findById(id)
      .populate("start_station")
      .populate("end_station");
  }

  async updateTrain(id, payload) {
    return await TrainModel.findOneAndUpdate(
      {
        _id: id,
      },
      payload,
    );
  }

  async deleteTrain(id) {
    await TrainModel.deleteOne({ _id: id });
  }

  async deleteManyTrainByStation(id) {
    await TrainModel.deleteMany({ start_station: id });
    await TrainModel.deleteMany({ end_station: id });
  }
}

export default new TrainRepository();
