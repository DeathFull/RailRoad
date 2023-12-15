import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import passport from "./passport.js";
import userRouter from "./routers/UserRouter.js";
import trainRouter from "./routers/trainRouter.js";
import trainstationRouter from "./routers/trainstationRouter.js";
import ticketRouter from "./routers/ticketRouter.js";

const app = express();

app.use(express.json());
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

app.get("/", (req, res) => {
  res.status(200).send("Bienvenue sur l'API RailRoad !");
});
app.use("/users", userRouter);
app.use("/trains", trainRouter);
app.use("/trainstations", trainstationRouter);
app.use("/tickets", ticketRouter);
export default app;
