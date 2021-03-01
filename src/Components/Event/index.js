import React from "react";
import "./style.scss";

const notificationIcon = require("../../../assets/icon-notification.svg");

export default function Event(props) {
  const { event } = props;

  const createEvent = () => {
    if (event.method == "Transfer") {
      return (
        <div className="event">
          <img src={notificationIcon} />
          <div className="event-details">
            <div className="event-name">
              {event.method}: <span className="amount">{event.data[2]}</span>
            </div>
            <div className="event-data">{event.data[0]}</div>
            <div className="event-data">{event.data[1]}</div>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  };
  return createEvent();
}
