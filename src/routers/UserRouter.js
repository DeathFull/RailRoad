import express from "express";
import UserRepository from "../repositories/UserRepository.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { user } = req.query;

  const users = await UserRepository.listUsers({});

  res.json(users);
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserRepository.getUserById(id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json(user);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

router.post("/", async (req, res) => {
  const user = await UserRepository.createUser(req.body);
  console.log("User created");

  res.status(201).json(user);
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await UserRepository.updateUser(id, req.body);
    console.log("User updated");
    res.json(req.body);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

router.delete("/:id", async (req, res) => {
  await UserRepository.deleteUser(req.params.id);
  console.log("User deleted");
  res.status(204).send();
});

export default router;
