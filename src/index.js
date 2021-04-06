import { Elm } from "./Main.elm";
import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import "regenerator-runtime/runtime";
import networks from "./networks";

const iconExplorer = require("../assets/icon-explorer.svg");
const iconWallet = require("../assets/icon-wallet.svg");
const iconContacts = require("../assets/icon-contacts.svg");
const iconGovernance = require("../assets/icon-governance.svg");
const iconNotification = require("../assets/icon-notification.svg");

const assets = {
  iconExplorer: iconExplorer,
  iconWallet: iconWallet,
  iconContacts: iconContacts,
  iconGovernance: iconGovernance,
  iconNotification: iconNotification,
};

let app = null;
let api = null;

let newBlocksUnsub = null;
let eventsUnsub = null;

let eventKey = 0;

async function getAccounts() {
  await web3Enable("Subwallet");
  const allAccounts = await web3Accounts();

  return allAccounts.map((account) => {
    return {
      address: account.address,
      genesisHash: account.meta.genesisHash || "",
      name: account.meta.name,
    };
  });
}

async function changeNetwork(endpoint) {
  if (newBlocksUnsub) newBlocksUnsub();
  if (eventsUnsub) eventsUnsub();

  const wsProvider = new WsProvider(endpoint);
  api = await ApiPromise.create({ provider: wsProvider });

  newBlocksUnsub = await api.query.system.number(async (blockNumber) => {
    const hash = await api.rpc.chain.getFinalizedHead();
    const finalizedBlock = await api.rpc.chain.getBlock(hash);
    const finBlockNum = finalizedBlock.block.header.number.toHuman();

    app.ports.newBlocks.send({
      latest: blockNumber.toHuman(),
      finalized: finBlockNum,
      author: "12345",
    });
  });

  eventsUnsub = await api.query.system.events((events) => {
    let newEvents = events
      .map((event) => event.toHuman().event)
      .filter((event) => event.method == "Transfer")
      .map((event) => {
        return {
          to: event.data[0],
          from: event.data[1],
          amount: event.data[2],
          key: (eventKey++).toString(),
        };
      });

    if (newEvents.length > 0) app.ports.newEvents.send(newEvents);
  });
}

async function start() {
  const accounts = await getAccounts();

  app = Elm.Main.init({
    node: document.getElementById("main"),
    flags: { assets: assets, networks: networks, accounts: accounts },
  });

  app.ports.changeNetwork.subscribe((endpoint) => {
    changeNetwork(endpoint);
  });

  changeNetwork("wss://rpc.polkadot.io");
}

start();
