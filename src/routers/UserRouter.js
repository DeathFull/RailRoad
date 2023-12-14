import express from "express";
import UserRepository from "../repositories/UserRepository.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";
import { z } from "zod";
import passport from "passport";
import { processRequestBody } from "zod-express-middleware";

const router = express.Router();

const UserRegisterSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

router.get("/", async (req, res) => {
  const users = await UserRepository.listUsers({});
  res.json(users);
});

router.get("/:id", authMiddleware, async (req, res) => {
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

router.post(
  "/register",
  processRequestBody(UserRegisterSchema),
  async (req, res) => {
    UserModel.register(
      new UserModel({
        username: req.body.username,
        email: req.body.email,
        role: "User",
      }),
      req.body.password,
      (err) => {
        if (err) {
          console.error(err);
          return res.status(400).json(err);
        }

        passport.authenticate("local")(req, res, () => {
          res.status(201).send("Created");
        });
      },
    );
  },
);

router.post("/login", passport.authenticate("local"), async (req, res) => {
  const { username } = req.body;

  UserModel.findByUsername(username, (_, user) => {
    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, { httpOnly: true });
  });

  console.log("User logged in");
  res.status(200).send("Logged");
});

router.put("/:id", authMiddleware, async (req, res) => {
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

router.delete("/:id", authMiddleware, async (req, res) => {
  await UserRepository.deleteUser(req.params.id);
  console.log("User deleted");
  res.status(204).send();
});

export default router;
