const express = require("express");
const router = express.Router();
const User = require("../model/users");
const Auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendEmailToUser } = require("../email/account");
router.post("/users/sign", async (req, res) => {
  try {
    const user = await User.create(req.body);
    sendEmailToUser(user.email, user.name);
    const token = await user.getAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
// router.get("/users/me", Auth, async (req, res) => {
//   res.send(req.user);
// });

router.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/users/me", Auth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(401).send({ error: "please authenticate" });
    console.log(error.message);
  }
});

router.patch("/users/me", Auth, async (req, res) => {
  try {
    const allowedUpdates = ["name", "email", "age", "password"];
    const updates = Object.keys(req.body);
    const correctUpdates = updates.every((item) => {
      return allowedUpdates.includes(item);
    });
    if (!correctUpdates) {
      return res.status(400).send({ error: "wrong key placement" });
    }
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: "pls check your password" });
    console.log(error.message);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );
    const token = await user.getAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post("/users/logout", Auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(401).send({ error: "pls authenticate" });
  }
});

router.post("/users/logout/others", Auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token === req.token;
    });
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/users/me", Auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const upload = multer({
  limits: {
    fileSize: 900000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(docx|xlsx)$/)) {
      cb(new Error("pls upload a word document or an excel document"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/users/me/upload",
  Auth,
  upload.single("upload"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send(req.user);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  },
);

router.delete("/users/me/upload", Auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send(req.user);
});
router.get("/users/:id/avatar", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user | !user.avatar) {
    throw new Error({ error: "profile picture not found" });
  }
  res.set(
    "content-type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  res.send(user.avatar);
});

const img = multer({
  limits: {
    fileSize: 9001000,
  },
});

router.post(
  "/upload/image",
  Auth,
  img.single("upload"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 200, height: 200 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.set("content-type", "png");
    res.send(req.user.avatar);
  },
  (error, req, res, next) => {
    res.send({ error: error.message });
  },
);

module.exports = router;
