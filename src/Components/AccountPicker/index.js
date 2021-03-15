import React, { useState, useEffect } from "react";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3ListRpcProviders,
  web3UseRpcProvider,
} from "@polkadot/extension-dapp";
import Identicon from "@polkadot/react-identicon";
import AccountCard from "../AccountCard";
import "./style.scss";

export default function AccountPicker(props) {
  const { api, setAccount } = props;
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [showAccountList, setShowAccountList] = useState(false);

  const selectAccount = async (account) => {
    const balance = (await api.query.system.account(account.address)).data.free;

    if (balance == 0) {
      setCurrentBalance("0 DOT");
    } else {
      setCurrentBalance(balance.toHuman());
    }

    setCurrentAccount(account);
    setAccount(account);
    setShowAccountList(false);
  };

  useEffect(() => {
    const setup = async () => {
      await web3Enable("Subwallet");
      const allAccounts = await web3Accounts();

      const balance = (await api.query.system.account(allAccounts[0].address))
        .data.free;

      if (balance == 0) {
        setCurrentBalance("0 DOT");
      } else {
        setCurrentBalance(balance.toHuman());
      }

      setAccounts(allAccounts);
      setCurrentAccount(allAccounts[0]);
      setAccount(allAccounts[0]);
    };

    setup();
  }, []);

  return (
    <div id="account-picker">
      <div id="current-account" onClick={() => setShowAccountList(true)}>
        <div id="balance">{currentBalance}</div>
        {currentAccount ? (
          <div id="account-info">
            {currentAccount.meta.name}
            <Identicon
              id="account-identicon"
              value={currentAccount.address}
              size={24}
              theme="polkadot"
            />
          </div>
        ) : null}
      </div>
      {showAccountList ? (
        <div id="account-list">
          {accounts.map((account, index) => {
            return (
              <AccountCard
                key={index}
                account={account}
                selectAccount={selectAccount}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
