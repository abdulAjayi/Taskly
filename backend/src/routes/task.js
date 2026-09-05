const Task = require("../model/task");
const express = require("express");
const router = express.Router();
const Auth = require("../middleware/auth");
router.post("/tasks", Auth, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      owner: req.user._id,
    });
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
router.get("/tasks/all", Auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const update = req.query.sortBy.split("_");
    sort[update[0]] = update[1] === "desc" ? -1 : 1;
  }
  try {
    const tasks = await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    if (!tasks) {
      res.status(400).send({ error: "task not found" });
    }
    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.patch("/tasks/:id", Auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedData = [
      "name",
      "age",
      "description",
      "email",
      "password",
      "completed",
    ];
    const correctData = updates.every((item) => {
      return allowedData.includes(item);
    });
    if (!correctData) {
      return res
        .status(400)
        .send({ error: "pls input values that matches the prescribed data" });
    }
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "user not found" });
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({ error: "user not found" });
  }
});
router.get("/tasks/:id", Auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await Task.findOne({ _id });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});
router.delete("/tasks/:id", Auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const tasks = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!tasks) {
      return res.status(404).send();
    }
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;
