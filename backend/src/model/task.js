const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      // trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

const model1 = mongoose.model("tasks", userSchema);
module.exports = model1;
