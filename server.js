const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { dbConnect } = require("./connections/database");
const { proposalData } = require("./models/proposals");
const cors = require("cors");
const { ethers } = require("ethers");
const { proposalDetails } = require("./models/proposalDetails");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api/", async (req, res, next) => {
 const data = await proposalDetails.find();
 const result = data.map((item) => ({
  objId: item._id,
  address: item.proposer_address,
  id: item.proposal_id,
  desc: item.proposal_description,
  startBlock: item.startBlock,
  endBlock: item.endBlock,
 }));
 res.status(200).json(result);
 next();
});

app.get("/api/views/:id", async (req, res, next) => {
 try {
  const objId = mongoose.Types.ObjectId(req.params.id.trim());
  const result = await proposalDetails.findById(objId);
  res.status(200).json(result);
 } catch (error) {
  console.log(error);
 }
});

app.post("/api/create", async (req, res, next) => {
 const txnHash = {
  proposal_hash: req.body.hash,
 };
 await proposalData.create(txnHash);

 try {
  const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/4fe7f542e65f479ca067fe05146f7ef2");

  const dataID = await proposalData.find().limit(1).sort({ $natural: -1 });

  const events = await provider.getTransactionReceipt(dataID[0].proposal_hash);
  const logs = events.logs[0].data;
  const decodeData = ethers.utils.defaultAbiCoder.decode(
   ["uint256", "address", "address[]", "uint256[]", "string[]", "bytes[]", "uint256", "uint256", "string"],
   logs
  );

  const proposerAddress = decodeData[1];
  const ID = decodeData[0].toString();
  const callDataID = decodeData[5];
  const values = decodeData[3];
  const targets = decodeData[2];
  const desc = decodeData[8];
  const startBlock = decodeData[6].toString();
  const endBlock = decodeData[7].toString();

  const ProposalData = {
   proposer_address: proposerAddress,
   proposal_id: ID,
   proposal_description: desc,
   startBlock: startBlock,
   endBlock: endBlock,
   calldata: callDataID[0],
   values: values[0],
   targetContract: targets[0],
  };

  const result = await proposalDetails.create(ProposalData);
  console.log(result);
  res.status(200).send("Proposal hash has been stored to DB");
 } catch (error) {
  res.status(500).send(error);
  next();
 }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
 console.error(`Connected to port ${port}`);
});
