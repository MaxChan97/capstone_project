import React from "react";
import TopStreamerRow from "./TopStreamerRow";

export default function TopStreamerCard({ data }) {
  return (
    <div className="card card-primary" style={{width: "20rem",  marginLeft:"20px"}}>
      <div className="card-body">
        <p className="font-weight-bold" style={{ marginBottom: "-3px" }}>
          Top Streamers
        </p>
        <ul class="list-group list-group-flush">
          {data.map((row, index) => {
            return (
              <li
                key={index}
                class="list-group-item"
                style={{ borderBottom: "none" }}
              >
                <TopStreamerRow data={row} rank={index} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
