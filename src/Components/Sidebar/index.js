import React, { useEffect } from "react";
import "./style.scss";

const contactsIcon = require("../../../assets/icon-contacts.svg");
const explorerIcon = require("../../../assets/icon-explorer.svg");
const walletIcon = require("../../../assets/icon-wallet.svg");
const governanceIcon = require("../../../assets/icon-governance.svg");

export default function Sidebar(props) {
  const { setPage } = props;

  const handleClick = (page) => {
    setPage(page);
    const selected = document.getElementsByClassName("selected");

    if (selected != []) {
      selected[0].classList.remove("selected");
    }

    document.getElementById(`${page}-button`).classList.add("selected");
  };

  useEffect(() => {
    document.getElementById("explorer-button").classList.add("selected");
  }, []);

  return (
    <div id="sidebar">
      <img
        id="explorer-button"
        src={explorerIcon}
        onClick={() => handleClick("explorer")}
      />
      <img
        id="wallet-button"
        src={walletIcon}
        onClick={() => handleClick("wallet")}
      />
      <img
        id="contacts-button"
        src={contactsIcon}
        onClick={() => handleClick("contacts")}
      />
      <img
        id="governance-button"
        src={governanceIcon}
        onClick={() => handleClick("governance")}
      />
    </div>
  );
}
