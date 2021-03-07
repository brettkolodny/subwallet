import React, { useEffect, useState, useRef } from "react";
import Event from "../../Components/Event";
// import { ReactComponent as Svg } from "../../../assets/ellipse.svg";
import "./style.scss";

const circle = (
  <svg
    width="98"
    height="98"
    viewBox="0 0 98 98"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      id="circle"
      className="path"
      cx="49"
      cy="49"
      r="45"
      stroke="#647ACB"
      strokeWidth="8"
    />
  </svg>
);

let nextKey = 0;

function BlockNumbers(props) {
  const { api } = props;

  const [time, setTime] = useState(0);
  const [bestBlock, setBestBlock] = useState("Loading...");
  const [finalizedBlock, setFinalizedBlock] = useState("Loading...");

  const incrementTimer = () => {
    const timeDiv = document.getElementById("time");

    if (timeDiv) {
      timeDiv.innerText = parseInt(timeDiv.innerText.split("")[0]) + 1 + "s";
      setTimeout(incrementTimer, 1000);
    }
  };

  const resetCircle = () => {
    const circleSvg = document.getElementById("circle");
    const newCricleSvg = circleSvg.cloneNode(true);

    circleSvg.replaceWith(newCricleSvg);
  };

  useEffect(() => {
    let unsubscribe;

    api.query.system
      .number(async (blockNumber) => {
        const hash = await api.rpc.chain.getFinalizedHead();
        const finalizedBlock = await api.rpc.chain.getBlock(hash);
        const finBlockNum = finalizedBlock.block.header.number.toHuman();

        setFinalizedBlock(() => finBlockNum);
        setBestBlock(() => blockNumber.toHuman());

        const timeDiv = document.getElementById("time");
        if (timeDiv) timeDiv.innerText = "0s";

        resetCircle();
      })
      .then((unsub) => {
        unsubscribe = unsub;
      });

    setTimeout(incrementTimer, 1000);

    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <div id="block-numbers-container">
      <div id="block-numbers">
        <div>
          <span className="block-number">{bestBlock}</span>{" "}
          <span className="label">best</span>
        </div>
        <div>
          <span className="block-number">{finalizedBlock}</span>{" "}
          <span className="label">finalized</span>
        </div>
      </div>
      <div id="block-time">
        {circle}
        <div id="time">0s</div>
      </div>
    </div>
  );
}

function RecentBlocks(props) {
  const { api } = props;
  const [blocks, setBlocks] = useState([]);

  const blocksRef = useRef();
  blocksRef.current = blocks;

  const getBlocks = () => {
    return blocks;
  };

  const updateBlocks = async () => {
    const unsub = await api.query.system.number((blockNumber) => {
      const address = "13arSPsihdfLnYzKhwXTJQAjejxTdbXwpMKUeTUq45mvR5K9";
      let newBlocks =
        blocksRef.current.length == 6
          ? blocksRef.current.slice(0, 5)
          : [...blocksRef.current];

      newBlocks.unshift({
        blockNumber: blockNumber.toHuman(),
        address: address,
      });

      setBlocks(() => [...newBlocks]);
    });

    return unsub;
  };

  useEffect(() => {
    let unsubscribe;
    updateBlocks().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <div id="recent-blocks">
      {blocks.map((block, index) => {
        return (
          <Block
            key={index}
            blockNumber={block.blockNumber}
            address={block.address}
          />
        );
      })}
    </div>
  );
}

function Block(props) {
  const { blockNumber, address } = props;

  return (
    <div className="block">
      <div className="block-number">{blockNumber}</div>
      <div className="address">{address}</div>
    </div>
  );
}

function RecentEvents(props) {
  const { api } = props;

  const [events, setEvents] = useState([]);
  const eventsRef = useRef();

  eventsRef.current = events;

  useEffect(() => {
    let unsubscribe;

    api.query.system
      .events((events) => {
        let newEvents = [...eventsRef.current];
        for (let e of events) {
          let eventHuman = e.toHuman().event;
          eventHuman.key = nextKey++;

          if (eventHuman.method == "Transfer") {
            newEvents.unshift(eventHuman);
          }
        }

        newEvents = newEvents.length > 5 ? newEvents.slice(0, 5) : newEvents;
        setEvents(() => newEvents);
      })
      .then((unsub) => (unsubscribe = unsub));

    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <div id="recent-events">
      {events.map((e) => {
        return <Event key={e.key} event={e} />;
      })}
    </div>
  );
}

export default function Explorer(props) {
  const { api } = props;

  return (
    <div id="explorer" className="view">
      <BlockNumbers api={api} />
      <div id="block-info">
        <RecentBlocks api={api} />
        <RecentEvents api={api} />
      </div>
    </div>
  );
}
