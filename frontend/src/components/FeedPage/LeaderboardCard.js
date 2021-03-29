import React from "react";
import LeaderboardRow from "./LeaderboardRow";

export default function LeaderboardCard({ data }) {
  return (
    <div className="card card-primary">
      <div className="card-body">
        <p className="font-weight-bold" style={{marginBottom: "-3px"}}>Top Contributors</p>
        <ul class="list-group list-group-flush">
          {data.map((row, index) => {
            return (
              <li key={index} class="list-group-item" style={{borderBottom: "none"}}>
                <LeaderboardRow data={row} rank={index}/>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
