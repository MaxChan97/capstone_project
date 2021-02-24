import React from "react";
import SubscriberRow from "./SubscriberRow";

export default function SubscriberCard({ subscriberList }) {

  return (
    subscriberList !== undefined ? (
      <div className="card card-primary">
        <div className="card-body">
          <p className="font-weight-bold">Subscribers</p>

          <p className="font-weight-light">

            <p className="font-weight-light"> Number of subscribers: {subscriberList.length}</p>

          </p>

          <ul class="list-group list-group-flush">
            {subscriberList.map((row, index) => {
              return (
                <li key={index} class="list-group-item">
                  <SubscriberRow subscriber={row} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

    ) : (""))
          }
