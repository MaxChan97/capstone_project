import React from "react";
import LeaderboardRow from "./LeaderboardRow";

export default function LeaderboardCard({ data }) {
  return (
    <div className="card card-primary">
      <div className="card-body">
        <p className="font-weight-bold">Top Streamers</p>
        <ul class="list-group list-group-flush">
          {data.map((row, index) => {
            return (
              <li key={index} class="list-group-item">
                <LeaderboardRow data={row} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
