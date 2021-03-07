import React, { useState } from "react";
import "./style.scss";

const polkadotLogo = require("../../../assets/polkadot-logo.svg");

export default function NetworkPicker(props) {
  const { networks, network, setNetwork } = props;

  const [showNetworks, setShowNetworks] = useState(false);

  const selectNetwork = (network) => {
    setShowNetworks(false);
    setNetwork(network);
  };

  return (
    <div id="network-picker">
      <img src={network.logo} onClick={() => setShowNetworks(true)} />
      {showNetworks ? (
        <div id="network-list">
          {networks.map((net, index) => (
            <img
              key={index}
              src={net.logo}
              onClick={() => selectNetwork(net)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
