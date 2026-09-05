const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
require("./db/mongoose");
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
module.exports = app;