const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userOne_id = new mongoose.Types.ObjectId();
const userTwo_id = new mongoose.Types.ObjectId();
const User = require("../../src/model/users");
const Task = require("../../src/model/task");
const userOne = {
  _id: userOne_id,
  name: "abdussomad",
  password: "123456789",
  email: "examasdfplsl23@gmail.com",
  tokens: [
    { token: jwt.sign({ _id: userOne_id }, process.env.AUTH_SECRET_CODE) },
  ],
};
const userTwo = {
  _id: userTwo_id,
  name: "abdussomad",
  password: "123456789",
  email: "examplwersl23@gmail.com",
  tokens: [
    { token: jwt.sign({ _id: userTwo_id }, process.env.AUTH_SECRET_CODE) },
  ],
};

const TaskOne = {
  _id: new mongoose.Types.ObjectId(),
  complete: false,
  description: "pls clean the house",
  owner: userOne._id,
};
const TaskTwo = {
  _id: new mongoose.Types.ObjectId(),
  complete: false,
  description: "pls wash the plate",
  owner: userOne._id,
};
const TaskThree = {
  _id: new mongoose.Types.ObjectId(),
  complete: true,
  description: "pls charge my laptop",
  owner: userTwo._id,
};

async function setDataBase() {
  await User.deleteMany();
  await Task.deleteMany();
  await User.create(userOne);
  await User.create(userTwo);
  await Task.create(TaskOne);
  await Task.create(TaskTwo);
  await Task.create(TaskThree);
}
module.exports = {
  userOne_id,
  userOne,
  TaskOne,
  TaskTwo,
  TaskThree,
  userTwo,
  setDataBase,
};
