const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
 proposal_hash: {
  type: String,
  required: true,
 },
});

const proposalData = mongoose.model("PROPOSAL", proposalSchema);
module.exports = { proposalData };
