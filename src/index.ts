import { getSchnorrAccount } from "@aztec/accounts/schnorr";
import { getDeployedTestAccountsWallets } from "@aztec/accounts/testing";
import {
  createPXEClient,
  waitForPXE,
} from "@aztec/aztec.js";
import { jwtVotingQuestContract } from "./artifacts/jwtVotingQuest.js";

import { format } from "util";

const { PXE_URL = "http://localhost:8080" } = process.env;

async function main() {
  ////////////// CREATE THE CLIENT INTERFACE AND CONTACT THE SANDBOX //////////////
  const pxe = createPXEClient(PXE_URL);
  await waitForPXE(pxe);
  const nodeInfo = await pxe.getNodeInfo();
  console.log(format("Aztec Sandbox Info ", nodeInfo));
  
  ////////////// LOAD INITIAL ACCOUNT FROM THE SANDBOX //////////////
const accounts = await getDeployedTestAccountsWallets(pxe);
const aliceWallet = accounts[0];
const alice = aliceWallet.getAddress();
console.log(`Loaded alice's account at ${alice.toString()}`);

////////////// DEPLOY OUR CONTRACT //////////////
const contract = await jwtVotingQuestContract.deploy(aliceWallet, aliceWallet.getAddress(), 1)
  .send()
  .deployed();

console.log(`Contract deployed at ${contract.address.toString()}`);


const tx = await contract.methods.cast_vote_simple(
  1,1
).send().wait();

console.log(`Tx sent, hash is ${tx.txHash.toString()}`);

}

main();