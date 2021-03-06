import React, { useState } from "react";

import "./style.scss";

const polkadotLogo = require("../../../assets/polkadot-logo.svg");

export default function NetworkPicker(props) {
  const [network, setNetwork] = useState("polkadot");

  return (
    <div id="network-picker">
      <img src={polkadotLogo} />
    </div>
  );
}
