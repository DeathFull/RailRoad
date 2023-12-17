import express from "express";
import UserRepository from "../repositories/UserRepository.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";
import { z } from "zod";
import passport from "passport";
import { processRequestBody } from "zod-express-middleware";
import { tokenMiddleware } from "../middlewares/tokenMiddleware.js";
import { updateUserMiddleware } from "../middlewares/updateUserMiddleware.js";
import { checkUserMiddleware } from "../middlewares/checkUserMiddleware.js";
import { employeeMiddleware } from "../middlewares/employeeMiddleware.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import dotenv from "dotenv";
import { objectIdMiddleware } from "../middlewares/objectIdMiddleware.js";

const router = express.Router();
dotenv.config();

const UserRegisterSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

router.get("/", tokenMiddleware, employeeMiddleware, async (req, res) => {
  const users = await UserRepository.listUsers();
  res.json(users);
});

router.get(
  "/:id",
  tokenMiddleware,
  objectIdMiddleware,
  checkUserMiddleware,
  async (req, res) => {
    const { id } = req.params;

    const user = await UserRepository.getUserById(id);

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  },
);

router.post(
  "/register",
  processRequestBody(UserRegisterSchema),
  async (req, res) => {
    const hasUserInDb = (await UserModel.countDocuments()) > 0;
    UserModel.register(
      new UserModel({
        username: req.body.username,
        email: req.body.email,
        role: hasUserInDb ? "User" : "Admin",
      }),
      req.body.password,
      (err, user) => {
        if (err) {
          console.error(err);
          return res.status(400).json(err);
        }

        passport.authenticate("local")(req, res, () => {
          res.status(201).send({ _id: user._id });
        });
      },
    );
  },
);

router.post("/login", passport.authenticate("local"), async (req, res) => {
  const { username } = req.body;

  const user = await UserModel.findOne(
    { username: username },
    { _id: 1, lastEdited: 1 },
  );

  const token = jwt.sign(
    {
      _id: user._id,
      lastEdited: user.lastEdited,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" },
  );

  res.cookie("token", token, { httpOnly: true });

  res.status(200).send("Logged");
});

router.put(
  "/:id",
  tokenMiddleware,
  objectIdMiddleware,
  updateUserMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const existingUser = await UserRepository.getUserById(id);
    if (existingUser) {
      if (req.user.role !== "Admin") {
        res.status(403).send("You are not allowed to edit this user");
        delete req.body.role;
      }
      if (req.body.password)
        existingUser.setPassword(req.body.password, () => {
          existingUser.save();
        });

      req.body.lastEdited = new Date();
      await UserRepository.updateUser(id, req.body);
    } else {
      return res.status(404).send("User not found");
    }
    res.json(req.body);
  },
);

router.delete(
  "/:id",
  tokenMiddleware,
  objectIdMiddleware,
  userMiddleware,
  async (req, res) => {
    await UserRepository.deleteUser(req.params.id);
    res.status(204).send();
  },
);

export default router;
