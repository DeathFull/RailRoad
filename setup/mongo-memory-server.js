import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, beforeAll } from "vitest";
import * as mongoose from "mongoose";

const mongoServer = await MongoMemoryServer.create({
  instance: { dbName: "railroad" },
});

beforeAll(async () => {
  await mongoose.connect(mongoServer.getUri(), {
    serverSelectionTimeoutMS: 5000,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
