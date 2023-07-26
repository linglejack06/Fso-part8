/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  favoriteGenre: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
