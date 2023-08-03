/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
  },
  born: {
    type: Number,
  },
  bookCount: {
    type: Number,
  },
});

authorSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Author", authorSchema, "authors");
