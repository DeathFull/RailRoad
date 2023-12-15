import { describe, expect, it } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { UserModel } from "../models/UserModel.js";
import UserRepository from "../repositories/UserRepository.js";

describe("User routes", () => {
  const req = request.agent(app);
  let userId;
  let employeeId;
  let adminId;
  const newUser = {
    username: "user",
    email: "test@test.com",
    password: "password",
  };
  const newEmployee = {
    username: "employee",
    email: "test@test.com",
    password: "password",
  };
  const newAdmin = {
    username: "admin",
    email: "test@test.com",
    password: "password",
  };

  describe("POST /register", () => {
    it("should register a new user (as admin user)", async () => {
      const response = await req.post("/users/register").send(newAdmin);
      expect(response.status).toBe(201);
      adminId = response.body._id;
    });

    it("should register a new user (as employee user)", async () => {
      const response = await req.post("/users/register").send(newEmployee);
      expect(response.status).toBe(201);
      employeeId = response.body._id;
      await UserRepository.updateUser(employeeId, { role: "Employee" });
    });

    it("should register a new user (as normal user)", async () => {
      const response = await req.post("/users/register").send(newUser);
      expect(response.status).toBe(201);
      userId = response.body._id;
    });
  });

  describe("POST /login (as admin user)", () => {
    it("should login a user", async () => {
      const response = await req
        .post("/users/login")
        .send({ username: newAdmin.username, password: newAdmin.password });
      expect(response.status).toBe(200);
      expect(response.headers["set-cookie"][1]).toBeDefined();
    });
  });

  describe("GET / (as admin user)", () => {
    it("should return a list of users with valid role", async () => {
      const response = await req.get("/users");
      const usersLength = await UserModel.countDocuments({}).exec();
      expect(response.status).toEqual(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(usersLength);
    });

    it("GET /:id should return my user", async () => {
      const response = await req.get(`/users/${adminId}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(adminId);
      expect(response.body.username).toBe(newAdmin.username);
    });

    it("GET /:id should return other user (as admin user)", async () => {
      const response = await req.get(`/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(userId);
      expect(response.body.username).toBe(newUser.username);
    });

    it("GET /:id should return 404 for non-existent user with valid ObjectID", async () => {
      const response = await req.get(`/users/${new mongoose.Types.ObjectId()}`);
      expect(response.status).toBe(404);
      expect(response.text).toBe("User not found");
    });
  });

  describe("PUT /:id (as admin user)", () => {
    it("should update a specific user", async () => {
      const updatedUser = {
        email: "updated@test.com",
      };
      const response = await req.put(`/users/${userId}`).send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body.email).toBe(updatedUser.email);
    });

    it("should update my user", async () => {
      const updatedUser = {
        email: "updated@test.com",
      };
      const response = await req.put(`/users/${adminId}`).send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body.email).toBe(updatedUser.email);
    });
  });

  describe("DELETE /:id (as admin user)", () => {
    it("should delete specific user", async () => {
      const response = await req.delete(`/users/${adminId}`);
      expect(response.status).toBe(204);
    });
  });

  describe("POST /login (as employee user)", () => {
    it("should login a user", async () => {
      const response = await req.post("/users/login").send({
        username: newEmployee.username,
        password: newEmployee.password,
      });
      expect(response.status).toBe(200);
      expect(response.headers["set-cookie"][1]).toBeDefined();
    });
  });

  describe("GET / (as employee user)", () => {
    it("should return a list of users with valid role", async () => {
      const response = await req.get("/users");
      const usersLength = await UserModel.countDocuments({}).exec();
      expect(response.status).toEqual(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(usersLength);
    });

    it("GET /:id should return my user", async () => {
      const response = await req.get(`/users/${employeeId}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(employeeId);
      expect(response.body.username).toBe(newEmployee.username);
    });

    it("GET /:id should return other user (as admin user)", async () => {
      const response = await req.get(`/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(userId);
      expect(response.body.username).toBe(newUser.username);
    });

    it("GET /:id should return 404 for non-existent user with valid ObjectID", async () => {
      const response = await req.get(`/users/${new mongoose.Types.ObjectId()}`);
      expect(response.status).toBe(404);
      expect(response.text).toBe("User not found");
    });
  });

  describe("DELETE /:id (as employee user)", () => {
    it("should delete my user", async () => {
      const response = await req.delete(`/users/${employeeId}`);
      expect(response.status).toBe(204);
    });

    it("should delete another user (return error)", async () => {
      const response = await req.delete(`/users/${userId}`);
      expect(response.status).toBe(403);
    });
  });

  describe("POST /login (as normal user)", () => {
    it("should login a user", async () => {
      const response = await req
        .post("/users/login")
        .send({ username: newUser.username, password: newUser.password });
      expect(response.status).toBe(200);
      expect(response.headers["set-cookie"][1]).toBeDefined();
    });
  });

  describe("PUT /:id (as normal user)", () => {
    it("should update a specific user (return error)", async () => {
      const updatedUser = {
        email: "updated@test.com",
      };
      const response = await req.put(`/users/${userId}`).send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body.email).toBe(updatedUser.email);
    });

    it("should update my user (return error)", async () => {
      const updatedUser = {
        email: "updated@test.com",
      };
      const response = await req.put(`/users/${employeeId}`).send(updatedUser);
      expect(response.status).toBe(403);
    });
  });

  describe("GET / (as normal user)", () => {
    it("should return a list of users with valid role (return error)", async () => {
      const response = await req.get("/users");
      const usersLength = await UserModel.countDocuments({}).exec();
      expect(response.status).toEqual(403);
    });

    it("GET /:id should return my user", async () => {
      const response = await req.get(`/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(userId);
      expect(response.body.username).toBe(newUser.username);
    });

    it("GET /:id should return other user (return error)", async () => {
      const response = await req.get(`/users/${adminId}`);
      expect(response.status).toBe(403);
    });

    it("GET /:id should return 404 for non-existent user with valid ObjectID (return error)", async () => {
      const response = await req.get(`/users/${new mongoose.Types.ObjectId()}`);
      expect(response.status).toBe(403);
    });
  });

  describe("PUT /:id (as normal user)", () => {
    it("should update a specific user (return error)", async () => {
      const updatedUser = {
        email: "updated@test.com",
      };
      const response = await req.put(`/users/${employeeId}`).send(updatedUser);
      expect(response.status).toBe(403);
    });

    it("should update my user", async () => {
      const updatedUser = {
        email: "updated@test.com",
      };
      const response = await req.put(`/users/${userId}`).send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body.email).toBe(updatedUser.email);
    });
  });

  describe("DELETE /:id (as normal user)", () => {
    it("should delete my user", async () => {
      const response = await req.delete(`/users/${userId}`);
      expect(response.status).toBe(204);
    });

    it("should delete another user (return error)", async () => {
      const response = await req.delete(`/users/${employeeId}`);
      expect(response.status).toBe(403);
    });
  });
});
