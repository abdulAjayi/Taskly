const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
require("./db/mongoose");
// The frontend and API run on different localhost ports in development.
// This API uses bearer headers rather than cookies, so a permissive origin
// policy is sufficient and does not enable credential sharing.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
module.exports = app;
