import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ApiPromise, WsProvider } from "@polkadot/api";
import Sidebar from "./Components/Sidebar";
import NetworkPicker from "./Components/NetworkPicker";
import AccountPicker from "./Components/AccountPicker";
import Explorer from "./Views/Explorer";
import Connecting from "./Views/Connecting";
import Wallet from "./Views/Wallet";
import networks from "./networks";

import "regenerator-runtime/runtime";

function App() {
  const [api, setApi] = useState(null);
  const [network, setNetwork] = useState(networks[0]);
  const [page, setPage] = useState("explorer");
  const [account, setAccount] = useState(null);

  const connect = async () => {
    setApi(null);
    const wsProvider = new WsProvider(network.endpoint);
    const newApi = await ApiPromise.create({ provider: wsProvider });

    setApi(() => newApi);
  };

  useEffect(() => {
    connect();
  }, [network]);

  return api ? (
    <div id="app">
      <NetworkPicker
        networks={networks}
        setNetwork={setNetwork}
        network={network}
      />
      <AccountPicker api={api} setAccount={setAccount} />
      <Sidebar setPage={setPage} />
      {page == "explorer" ? <Explorer api={api} /> : null}
      {page == "wallet" ? <Wallet api={api} account={account.address} /> : null}
    </div>
  ) : (
    <div id="app">
      <Sidebar setPage={setPage} />
      <Connecting />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
