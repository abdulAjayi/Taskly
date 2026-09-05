const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/users");
const { userOne_id, userOne, setDataBase } = require("../tests/fixtures/db");
beforeEach(setDataBase, 20000);
test("this is to test for patch", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "jesse",
    });
  const user = await User.findById(userOne_id);
  expect(user.name).toBe("jesse");
});

// test("this is a test to confirm image upload", async () => {
//   await request(app)
//     .post("/upload/image")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .attach("upload", "tests/fixtures/testimage.jpg");

//   const user = await User.findById(userOne_id);
//   expect(user.avatar).toEqual(expect.any(Buffer));
// });

test("this is to test users", async () => {
  const response = await request(app)
    .post("/users/sign")
    .send({
      name: "abdul",
      password: "lkjfwe98wjefkjfj",
      email: "kjexakkkkjmple@gmail.com",
    })
    .expect(201);
  const users = await User.findById(response.body.user._id);
  expect(users).not.toBeNull();
  expect(users.name).toBe("abdul");
  expect(response.body).toMatchObject({
    user: {
      name: "abdul",
      email: "kjexakkkkjmple@gmail.com",
    },
    token: users.tokens[0].token,
  });
});

test("this is to test for login", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      name: userOne.name,
      password: userOne.password,
      email: userOne.email,
    })
    .expect(200);
  const user = await User.findById(response.body.user._id);
  expect(response.body).toMatchObject({
    user: {
      name: userOne.name,
      email: userOne.email,
    },
    token: user.tokens[1].token,
  });
});

test("test for not found", async () => {
  await request(app)
    .post("/users/login")
    .send({
      name: userOne.name,
      email: userOne.email,
      password: "heidf9293rojf",
    })
    .expect(404);
});

test("should get authenticated user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should delete user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(user).toBeNull();
});

test("this is an unAuthorized check", async () => {
  await request(app).delete("/users/me").send().expect(401);
});
