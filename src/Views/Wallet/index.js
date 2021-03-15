import React, { useEffect, useState } from "react";
import TxCard from "../../Components/TxCard";
import DateDivider from "../../Components/DateDivider";
import "./style.scss";

export default function Wallet(props) {
  const { account, api } = props;
  const [transactions, setTransactions] = useState([]);
  const [accountInfo, setAccountInfo] = useState(null);

  const getLatestTransactions = async () => {
    const url = "https://polkadot.api.subscan.io/api/scan/transfers";
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        row: 10,
        page: 0,
        address: "1yrUupBDQhkYArLViHHuTtHRCBKAZTTU6PUcFpiDUF58wes",
      }),
    });

    const data = (await response.json()).data;

    if (data.count > 0) {
      let latestTransactions = [];

      let date = null;
      for (let i = 0; i < data.transfers.length; i++) {
        let blockDate = new Date(0);
        blockDate.setUTCSeconds(data.transfers[i]["block_timestamp"]);

        if (
          date == null ||
          blockDate.getMonth() != date.getMonth() ||
          blockDate.getDay() != date.getDay()
        ) {
          latestTransactions.push({
            day: blockDate.getDate(),
            month: blockDate.getMonth(),
          });

          date = blockDate;
        }

        const action =
          data.transfers[i].to ==
          "1yrUupBDQhkYArLViHHuTtHRCBKAZTTU6PUcFpiDUF58wes"
            ? { from: data.transfers[i].from }
            : { to: data.transfers[i].to };

        latestTransactions.push({
          ...action,
          amount: data.transfers[i].amount,
          hash: data.transfers[i].hash,
        });
      }

      setTransactions(latestTransactions);
    }
  };

  useEffect(() => {
    getLatestTransactions();

    api.query.system.account(
      "1yrUupBDQhkYArLViHHuTtHRCBKAZTTU6PUcFpiDUF58wes",
      (info) => {
        setAccountInfo(info.data);
      }
    );
  }, [account]);

  return (
    <div id="wallet">
      <div id="balance-info">
        <div className="balance-card">
          <div className="amount">
            {
              // Fix this later not to round up
              accountInfo
                ? `${(accountInfo.free / 10000000000).toFixed(3)}`
                : "..."
            }
          </div>
          <div className="label">Total</div>
        </div>
        <div className="balance-card">
          <div className="amount">
            {
              // Fix this later not to round up
              accountInfo
                ? `${(
                    (accountInfo.free - accountInfo.miscFrozen) /
                    10000000000
                  ).toFixed(3)}`
                : "..."
            }
          </div>
          <div className="label">Available</div>
        </div>
      </div>

      {transactions.map((tx, index) => {
        if (tx.day != undefined) {
          return <DateDivider key={index} day={tx.day} month={tx.month} />;
        } else {
          return <TxCard key={index} transaction={tx} />;
        }
      })}
    </div>
  );
}
