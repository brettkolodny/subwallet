import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ApiPromise, WsProvider } from "@polkadot/api";
import Sidebar from "./Components/Sidebar";
import NetworkPicker from "./Components/NetworkPicker";
import AccountPicker from "./Components/AccountPicker";
import Explorer from "./Views/Explorer";
import Connecting from "./Views/Connecting";
import networks from "./networks";

import "regenerator-runtime/runtime";

function App() {
  const [api, setApi] = useState(null);
  const [network, setNetwork] = useState(networks[0]);

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
      <AccountPicker api={api} />
      <Sidebar />
      <Explorer api={api} />
    </div>
  ) : (
    <div id="app">
      <Sidebar />
      <Connecting />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
