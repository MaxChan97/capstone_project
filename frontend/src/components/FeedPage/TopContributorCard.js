import React from "react";
import TopContributorRow from "./TopContributorRow";

export default function TopContributorCard({ data }) {
  return (
    <div className="card card-primary" style={{ width: "68%" }}>
      <div className="card-body">
        <p className="font-weight-bold" style={{ marginBottom: "-3px" }}>
          Top Contributors
        </p>
        <ul class="list-group list-group-flush">
          {data.map((row, index) => {
            return (
              <li
                key={index}
                class="list-group-item"
                style={{ borderBottom: "none" }}
              >
                <TopContributorRow data={row} rank={index} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
