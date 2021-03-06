import React from "react";
import Identicon from "@polkadot/react-identicon";
import "./style.scss";

export default function AccountCard(props) {
  const { account, selectAccount } = props;

  return (
    <div className="account-card" onClick={() => selectAccount(account)}>
      {account.meta.name}
      <Identicon value={account.address} size={32} theme="polkadot" />
    </div>
  );
}
