const {
  userOne,
  setDataBase,
  TaskOne,
  TaskTwo,
  TaskThree,
  userTwo,
} = require("../tests/fixtures/db");
const Task = require("../src/model/task");
const app = require("../src/app");
beforeEach(setDataBase, 20000);
const request = require("supertest");

test("to test for creating task", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "lay the bed tomorrow hmm?",
    });
  expect(201);
  const task = Task.findById(response.body._id);
  expect(task).not.toBeNull();
});

test("to test for task of userOne", async () => {
  const response = await request(app)
    .get("/tasks/all")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`);
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
});

test("to test for task deletion of task one", async () => {
  const response = await request(app)
    .delete(`/tasks/${TaskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`);
  expect(response.status).toBe(200);
});

test("this is to test for task two", async () => {
  const response = await request(app)
    .delete(`/tasks/${TaskThree._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`);
  expect(response.status).toBe(200);
});
