const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../model/task");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
    },
    password: {
      required: true,
      minlength: 6,
      type: String,
      validate(value) {
        if (value.includes("password")) {
          throw new Error(
            `your password can't be "password", pls input another valid one`,
          );
        }
      },
    },
    email: {
      unique: true,
      required: true,
      type: String,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(
            "you just entered a wrong email, pls enter a correct one",
          );
        }
      },
    },
    tokens: [
      {
        token: {
          type: "String",
          required: "true",
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual("tasks", {
  ref: Task,
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.getAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id }, process.env.AUTH_SECRET_CODE);
  user.tokens = [...user.tokens, { token }];
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await model.findOne({ email });
  if (!user) {
    throw new Error("unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to login");
  }
  return user;
};

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 4);
  }
});

userSchema.pre("remove", async function () {
  const user = this;
  await Task.findOneAndDelete({ owner: user._id });
});

const model = mongoose.model("user", userSchema);
module.exports = model;
