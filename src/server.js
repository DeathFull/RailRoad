import "./mongo.js";
import app from "./app.js";

const port = 3000;

app.listen(port, () => {
  console.log(`RailRoad listening at http://localhost:${port}`);
});
