import React from "react";
import UserRow from "./UserRow";

export default function SubscriberCard({ data }) {
  return (
    <div className="card card-primary">
      <div className="card-body">
        <p className="font-weight-bold">Subscribers</p>
        <p className="font-weight-light">Number of subscribers:</p>
        <ul class="list-group list-group-flush">
          {data.map((row, index) => {
            return (
              <li key={index} class="list-group-item">
                <UserRow data={row} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
