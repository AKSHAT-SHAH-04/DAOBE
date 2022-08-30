const mongoose = require("mongoose");

const proposalDetailsSchema = new mongoose.Schema({
 proposer_address: {
  type: String,
  required: true,
 },
 proposal_id: {
  type: String,
  required: true,
 },
 proposal_description: {
  type: String,
  required: true,
 },
 startBlock: {
  type: Number,
  required: true,
 },
 endBlock: {
  type: Number,
  required: true,
 },
 calldata: {
  type: String,
  required: true,
 },
 values: {
  type: String,
  required: true,
 },
 targetContract: {
  type: String,
  required: true,
 },
});

const proposalDetails = mongoose.model("PROPOSAL-DETAILS", proposalDetailsSchema);
module.exports = { proposalDetails };
