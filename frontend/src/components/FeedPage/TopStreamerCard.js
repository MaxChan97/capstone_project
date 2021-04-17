import React from "react";
import TopStreamerRow from "./TopStreamerRow";

export default function TopStreamerCard({ data }) {
  return (
    <div className="card card-primary">
      <div className="card-body">
        <p className="font-weight-bold">Top Streamers</p>
        {data.map((row, index) => {
          return <TopStreamerRow key={index} data={row} rank={index} />;
        })}
      </div>
    </div>
  );
}
