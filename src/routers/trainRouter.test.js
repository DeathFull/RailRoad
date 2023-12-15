import { beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app.js";
import { TrainModel } from "../models/trainModel.js";
import { json } from "express";

dotenv.config();
describe("Train routes", () => {
  const request = supertest(app);
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  });

  it("GET / should return a list of trains", async () => {
    const trainsLength = await TrainModel.countDocuments({}).exec();
    const response = await request.get("/trains");
    expect(response.status).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(trainsLength);
  });

  it("GET /:id should return a specific train", async ({ assert }) => {
    const response = await request.get("/1"); // assuming there is a train with id 1
    assert.is(response.status, 200);
    assert.is(response.body.id, 1);
  });

  it("GET /:id should return 404 for non-existent train", async ({
    assert,
  }) => {
    const response = await request.get("/9999"); // assuming there is no train with id 9999
    assert.is(response.status, 404);
  });

  describe("POST /", () => {
    it("should create a new train", async ({ assert }) => {
      const newTrain = { name: "Test Train", speed: 100 };
      const response = await request.post("/").send(newTrain);
      assert.is(response.status, 201);
      assert.is(response.body.name, newTrain.name);
      assert.is(response.body.speed, newTrain.speed);
    });
  });

  describe("PUT /:id", () => {
    it("should update a specific train", async ({ assert }) => {
      const updatedTrain = { name: "Updated Test Train", speed: 200 };
      const response = await request.put("/1").send(updatedTrain); // assuming there is a train with id 1
      assert.is(response.status, 200);
      assert.is(response.body.name, updatedTrain.name);
      assert.is(response.body.speed, updatedTrain.speed);
    });
  });

  describe("DELETE /:id", () => {
    it("should delete a specific train", async ({ assert }) => {
      const response = await request.delete("/1"); // assuming there is a train with id 1
      assert.is(response.status, 204);
    });
  });
});
