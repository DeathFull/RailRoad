import { afterAll, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { TrainModel } from "../models/trainModel.js";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongoServer = await MongoMemoryServer.create({
  instance: { dbName: "railroad" },
});

describe("Train routes", () => {
  beforeAll(async () => {
    await mongoose.connect(mongoServer.getUri(), {
      serverSelectionTimeoutMS: 5000,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  const request = supertest(app);
  let trainId;
  const newTrain = {
    name: "Test Train",
    start_station: "Station A",
    end_station: "Station B",
    time_of_departure: new Date(),
  };

  describe("POST /", () => {
    it("should create a new train", async () => {
      let response = await request.post("/trains").send(newTrain);
      expect(response.status).toBe(201);
      expect(response.body.start_station).toBe(newTrain.start_station);
      expect(response.body.end_station).toBe(newTrain.end_station);
      expect(response.body.time_of_departure.toString()).toBe(
        newTrain.time_of_departure.toISOString(),
      );

      trainId = response.body._id;
    });
  });

  describe("GET /trains", () => {
    it("GET / should return a list of trains", async () => {
      const response = await request.get("/trains?limit=0");
      const trainsLength = await TrainModel.countDocuments({}).exec();
      expect(response.status).toEqual(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(trainsLength);
    });

    it("GET /:id should return a specific train", async () => {
      const response = await request.get(`/trains/${trainId}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(trainId);
      expect(response.body.name).toBe(newTrain.name);
      expect(response.body.start_station).toBe(newTrain.start_station);
      expect(response.body.end_station).toBe(newTrain.end_station);
    });

    it("GET /:id should return 400 for non-existent train with invalid ObjectID", async () => {
      const response = await request.get("/trains/test");
      expect(response.status).toBe(400);
      expect(response.text).toBe("Invalid ObjectId");
    });

    it("GET /:id should return 404 for non-existent train with valid ObjectID", async () => {
      const response = await request.get(
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
        start_station: "Updated Station A",
        end_station: "Updated Station B",
        time_of_departure: new Date(),
      };
      const response = await request
        .put(`/trains/${trainId}`)
        .send(updatedTrain);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedTrain.name);
      expect(response.body.start_station).toBe(updatedTrain.start_station);
      expect(response.body.end_station).toBe(updatedTrain.end_station);
      expect(new Date(response.body.time_of_departure)).toEqual(
        updatedTrain.time_of_departure,
      );
    });
  });

  describe("DELETE /:id", () => {
    it("should delete a specific train", async () => {
      const response = await request.delete(`/trains/${trainId}`);
      expect(response.status).toBe(204);
    });
  });
});
