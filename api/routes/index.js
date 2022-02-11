import express from "express";

const Router = express.Router();

/* GET home page. */
Router.get("/", function(req, res) {
  return res.send({ success: true, date: new Date().getYearStart() });
});

export const indexRouter = Router;
