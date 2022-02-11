import express from "express";
import cors from "cors";
import { indexRouter } from "api/routes/index.js";
import "shared/overrides/index.js";

const App = express();
const port = process.env.PORT || 3001;

App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ extended: false }));
App.use("/", indexRouter);

App.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
