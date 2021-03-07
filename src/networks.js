const acalaLogo = require("../assets/acala-logo.svg");
const polkadotLogo = require("../assets/polkadot-logo.svg");
const moonbeamLogo = require("../assets/moonbeam-logo.png");
const kusamaLogo = require("../assets/kusama-logo.gif");

const networks = [
  {
    name: "Polkadot",
    endpoint: "wss://rpc.polkadot.io",
    logo: polkadotLogo,
  },
  {
    name: "Kusama",
    endpoint: "wss://kusama-rpc.polkadot.io",
    logo: kusamaLogo,
  },
  {
    name: "Acala",
    endpoint: "wss://node-6714447553211260928.rz.onfinality.io/ws",
    logo: acalaLogo,
  },
  {
    name: "Moonbeam",
    endpoint: "wss://wss.testnet.moonbeam.network",
    logo: moonbeamLogo,
  },
];

export default networks;
