import React from "react";
import "./style.scss";

const contactsIcon = require("../../../assets/icon-contacts.svg");
const explorerIcon = require("../../../assets/icon-explorer.svg");
const walletIcon = require("../../../assets/icon-wallet.svg");
const governanceIcon = require("../../../assets/icon-governance.svg");

export default function Sidebar() {
  return (
    <div id="sidebar">
      <img className="selected" src={explorerIcon} />
      <img src={walletIcon} />
      <img src={contactsIcon} />
      <img src={governanceIcon} />
    </div>
  );
}
