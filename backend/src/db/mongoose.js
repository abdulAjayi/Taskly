const mongoose = require("mongoose");
async function connectMongoose() {
  try {
    await mongoose.connect(process.env.DB_CONNECTOR);
  } catch (error) {
    console.log(`error from connection to database:`, error.message);
  }
}
connectMongoose()
// module.exports = connectMongoose;
