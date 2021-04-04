import { Elm } from "./Main.elm";
import { ApiPromise, WsProvider } from "@polkadot/api";
import 'regenerator-runtime/runtime'

const iconExplorer = require("../assets/icon-explorer.svg");
const iconWallet = require("../assets/icon-wallet.svg");
const iconContacts = require("../assets/icon-contacts.svg");
const iconGovernance = require("../assets/icon-governance.svg");

async function start() {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  const assets = {
    iconExplorer: iconExplorer,
    iconWallet: iconWallet,
    iconContacts: iconContacts,
    iconGovernance: iconGovernance
  };
  
  const app = Elm.Main.init({
    node: document.getElementById("main"),
    flags: assets
  })
  
  const unsub = await api.query.system.number(async (blockNumber) => {
    const hash = await api.rpc.chain.getFinalizedHead();
    const finalizedBlock = await api.rpc.chain.getBlock(hash);
    const finBlockNum = finalizedBlock.block.header.number.toHuman();
  
    app.ports.newBlocks.send(
      { 
        latest: blockNumber.toHuman(), 
        finalized: finBlockNum,
        author: "12345"
      });
  });
}

start();