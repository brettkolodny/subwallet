import { Elm } from "./Main.elm";
import { ApiPromise, WsProvider } from "@polkadot/api";
import 'regenerator-runtime/runtime'

const iconExplorer = require("../assets/icon-explorer.svg");
const iconWallet = require("../assets/icon-wallet.svg");
const iconContacts = require("../assets/icon-contacts.svg");
const iconGovernance = require("../assets/icon-governance.svg");
const iconNotification = require("../assets/icon-notification.svg");

let newBlocksSub = null;
let eventsSub = null;

let eventKey = 0;

async function start() {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  const assets = {
    iconExplorer: iconExplorer,
    iconWallet: iconWallet,
    iconContacts: iconContacts,
    iconGovernance: iconGovernance,
    iconNotification: iconNotification
  };
  
  const app = Elm.Main.init({
    node: document.getElementById("main"),
    flags: assets
  })
  
  newBlocksSub = await api.query.system.number(async (blockNumber) => {
    const hash = await api.rpc.chain.getFinalizedHead();
    const finalizedBlock = await api.rpc.chain.getBlock(hash);
    const finBlockNum = finalizedBlock.block.header.number.toHuman();
  
    app.ports.newBlocks.send(
      { 
        latest: blockNumber.toHuman(), 
        finalized: finBlockNum,
        author: "12345",
      });
  });

  eventsSub = await api.query.system.events((events) => {
    const newEvents = [];

    for (const event of events) {
      const eventFormatted = event.toHuman().event;

      if (eventFormatted.method == "Transfer") {
        newEvents.push({
          to: eventFormatted.data[0],
          from: eventFormatted.data[1],
          amount: eventFormatted.data[2],
          key: (eventKey++).toString()
        });
      }
    }

    if (newEvents.length > 0) app.ports.newEvents.send(newEvents);
  })
}

start();