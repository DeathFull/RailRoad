import {UserModel} from "../models/UserModel.js";

class UserRepository {
  async listUsers() {
    const users = await UserModel.find(
      {},
      {
        username: true,
        role: true,
      }
    );
    return users;
  }

  async createUser(userPayload) {
    return await UserModel.create(userPayload);
  }

  async getUserById(id) {
    return await UserModel.findById(id);
  }

  async updateUser(id, payload) {
    const newUser = await UserModel.findOneAndUpdate(
      {
        _id: id,
      },
      payload
    );

    return newUser;
  }

  async deleteUser(id) {
    await UserModel.deleteOne({_id: id});
  }
}

export default new UserRepository();