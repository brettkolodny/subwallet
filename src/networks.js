const acalaLogo = require("../assets/acala-logo.svg");
const polkadotLogo = require("../assets/polkadot-logo.svg");
const moonbeamLogo = require("../assets/moonbeam-logo.png");
const kusamaLogo = require("../assets/kusama-logo.gif");

const networks = [
  {
    name: "Polkadot",
    endpoint: "wss://rpc.polkadot.io",
    genesisHash: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
    logo: polkadotLogo,
  },
  {
    name: "Kusama",
    endpoint: "wss://kusama-rpc.polkadot.io",
    genesisHash: "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe",
    logo: kusamaLogo,
  },
  {
    name: "Acala",
    endpoint: "wss://node-6714447553211260928.rz.onfinality.io/ws",
    genesisHash: "",
    logo: acalaLogo,
  },
  {
    name: "Moonbeam",
    endpoint: "wss://wss.testnet.moonbeam.network",
    genesisHash: "",
    logo: moonbeamLogo,
  },
];

export default networks;
