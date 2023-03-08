const mongoose = require("mongoose");

const RankSchema = new mongoose.Schema({
  Institute_Name: {
    type: String,
    // maxlength: 100,
    // required: [true, "Please provide Institute Name"],
  },
  Branch_Name: {
    type: String,
    // maxlength: 100,
    // required: [true, "Please provide Branch name"],
  },
  Quota: {
    type: String,
    maxlength: 10,
    // required: [true, "Please provide Quota"],
  },
  Seat_Type: {
    type: String,
    maxlength: 15,
    // required: [true, "Please provide Seat Type"],
  },
  Gender: {
    type: String,
    // maxlength: 20,
    // required: [true, "Please provide Gender"],
  },
  Opening_Rank: {
    type: String,
    maxlength: 10,
    // required: [true, "Please provide Opening Rank"],
  },
  Closing_Rank: {
    type: String,
    maxlength: 10,
    // required: [true, "Please provide Closing Rank"],
  },
  year: {
    type: String,
    maxlength: 10,
    // required: [true, "Please provide Year"],
  },
  Institute_Type: {
    type: String,
    maxlength: 10,
    // required: [true, "Please provide Institute Type"],
  },
});

module.exports = mongoose.model("clgRank", RankSchema);
