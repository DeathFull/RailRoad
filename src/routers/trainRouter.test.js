import { describe, expect, it } from "vitest";
import request from "supertest";
import mongoose, { Types } from "mongoose";
import app from "../app.js";
import { TrainModel } from "../models/trainModel.js";

describe("Train routes", async () => {
  const req = request.agent(app);
  let adminId;
  const newAdmin = {
    username: "admin",
    email: "test@test.com",
    password: "password",
  };

  let trainId;
  let newTrain;

  it("should register a new user (as admin user)", async () => {
    const response = await req.post("/users/register").send(newAdmin);
    expect(response.status).toBe(201);
    adminId = response.body._id;
  });

  it("should login a user", async () => {
    const response = await req
      .post("/users/login")
      .send({ username: newAdmin.username, password: newAdmin.password });
    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"][1]).toBeDefined();
  });

  it("should setup project", async () => {
    const stationPayload = {
      name: "Marseille",
      open_hour: "06:30",
      close_hour: "23:00",
      image: "test",
    };

    const stationPayload1 = {
      name: "Paris",
      open_hour: "06:30",
      close_hour: "23:00",
      image: "test",
    };

    await req.post("/trainstations").send(stationPayload);
    await req.post("/trainstations").send(stationPayload1);

    const allstations = await req.get("/trainstations");
    const station = new Types.ObjectId(allstations.body[0]._id);
    const station1 = new Types.ObjectId(allstations.body[1]._id);
    newTrain = {
      name: "train",
      start_station: station,
      end_station: station1,
      time_of_departure: new Date(),
    };
  }, 10000);

  describe("POST /", () => {
    it("should create a new train", async () => {
      let response = await req.post("/trains").send(newTrain);
      trainId = response.body._id;
      console.log(response.body);
      expect(response.status).toBe(201);
      expect(response.body.start_station).toBe(
        newTrain.start_station.toString(),
      );
      expect(response.body.end_station).toBe(newTrain.end_station.toString());
      expect(response.body.time_of_departure.toString()).toBe(
        newTrain.time_of_departure.toISOString(),
      );
    });
  });

  describe("GET /trains", () => {
    it("GET / should return a list of trains", async () => {
      const response = await req.get("/trains?limit=0");
      const trainsLength = await TrainModel.countDocuments({}).exec();
      expect(response.status).toEqual(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(trainsLength);
    });

    it("GET /:id should return a specific train", async () => {
      const response = await req.get(`/trains/${trainId}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(trainId);
      expect(response.body.name).toBe(newTrain.name);
      expect(response.body.start_station._id).toBe(
        newTrain.start_station.toString(),
      );
      expect(response.body.end_station._id).toBe(
        newTrain.end_station.toString(),
      );
    });

    it("GET /:id should return 400 for non-existent train with invalid ObjectID", async () => {
      const response = await req.get("/trains/test");
      expect(response.status).toBe(400);
      expect(response.text).toBe("Bad Request");
    });

    it("GET /:id should return 404 for non-existent train with valid ObjectID", async () => {
      const response = await req.get(
        `/trains/${new mongoose.Types.ObjectId()} `,
      );
      expect(response.status).toBe(404);
      expect(response.text).toBe("Train not found");
    });
  });

  describe("PUT /:id", () => {
    it("should update a specific train", async () => {
      const updatedTrain = {
        name: "Updated Test Train",
        time_of_departure: new Date(),
      };
      const response = await req.put(`/trains/${trainId}`).send(updatedTrain);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedTrain.name);
      expect(new Date(response.body.time_of_departure)).toEqual(
        updatedTrain.time_of_departure,
      );
    });
  });

  describe("DELETE /:id", () => {
    it("should delete a specific train", async () => {
      const response = await req.delete(`/trains/${trainId}`);
      expect(response.status).toBe(204);
    });
  });
});
