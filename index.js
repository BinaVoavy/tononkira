import express from "express";
import setParams from "./middleware/setParams.js";
import route from "./routes/route.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 7000;
app.use(cors());
app.use(setParams);
app.use("/", route);

app.listen(PORT, () => {
  console.log("server launched on port" + PORT);
});
