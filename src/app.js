import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import passport from "./passport.js";
import userRouter from "./routers/UserRouter.js";
import { parse } from "yaml";
import trainRouter from "./routers/trainRouter.js";
import trainstationRouter from "./routers/trainstationRouter.js";
import ticketRouter from "./routers/ticketRouter.js";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs/promises";

const app = express();
dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  session({
    secret: "thesupersecretkey",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(cors({}));
app.use(passport.initialize());
app.use(passport.session({}));

const swaggerDocument = parse(await fs.readFile("./swagger.yaml", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.status(200).send("Bienvenue sur l'API RailRoad !");
});
app.use("/users", userRouter);
app.use("/trains", trainRouter);
app.use("/trainstations", trainstationRouter);
app.use("/tickets", ticketRouter);
export default app;
