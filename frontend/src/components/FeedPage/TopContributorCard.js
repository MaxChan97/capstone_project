import React from "react";
import TopContributorRow from "./TopContributorRow";

export default function TopContributorCard({ data }) {
  return (
    <div className="card card-primary">
      <div className="card-body">
        <p className="font-weight-bold">Top Contributors</p>
        {data.map((row, index) => {
          return <TopContributorRow key={index} data={row} rank={index} />;
        })}
      </div>
    </div>
  );
}
