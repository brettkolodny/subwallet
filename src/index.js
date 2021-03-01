import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ApiPromise, WsProvider } from "@polkadot/api";
import Sidebar from "./Components/Sidebar";
import Explorer from "./Views/Explorer";
import Connecting from "./Views/Connecting";

import "regenerator-runtime/runtime";

function App() {
  const [api, setApi] = useState(null);

  useEffect(() => {
    const connect = async () => {
      const wsProvider = new WsProvider("wss://rpc.polkadot.io");
      const newApi = await ApiPromise.create({ provider: wsProvider });

      setApi(() => newApi);
    };

    connect();
  }, []);

  return (
    <div id="app">
      <Sidebar />
      {api ? <Explorer api={api} /> : <Connecting />}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
