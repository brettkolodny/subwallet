import React from "react";
import "./style.scss";

const downArrowSvg = require("../../../assets/down-arrow-icon.svg");
const upArrowSvg = require("../../../assets/up-arrow-icon.svg");
const rightArrowSvg = require("../../../assets/right-arrow-icon.svg");
const subscanLogo = require("../../../assets/subscan-logo.svg");
const polkacanLogo = require("../../../assets/polkascan-logo.svg");

export default function TxCard(props) {
  const { transaction } = props;

  return (
    <div className="tx-card">
      <div className="tx-info">
        {transaction.to ? <img src={upArrowSvg} /> : <img src={downArrowSvg} />}
        <div className="tx-info-text">
          <div className="amount">{transaction.amount} DOT</div>
          <div className="account">
            {transaction.to
              ? `${transaction.to.slice(0, 4)}...${transaction.to.slice(
                  transaction.to.length - 4
                )}`
              : `${transaction.from.slice(0, 4)}...${transaction.from.slice(
                  transaction.from.length - 4
                )}`}
          </div>
        </div>
      </div>
      <div className="links">
        <a
          href={`https://polkadot.subscan.io/extrinsic/${transaction.hash}`}
          target="_blank"
        >
          <img src={subscanLogo} />
        </a>
        <a
          href={`https://polkascan.io/polkadot/transaction/${transaction.hash}`}
          target="_blank"
        >
          <img src={polkacanLogo} />
        </a>
      </div>
    </div>
  );
}
