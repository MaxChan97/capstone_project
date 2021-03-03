import React from "react";
import TopCommunitiesRow from "./TopCommuntiesRow";
import Box from "@material-ui/core/Box";

export default function TopCommunitiesCard({ data }) {
  return (
    // <div className="card card-primary">
      <div className="card-body">
        <Box fontWeight="500" fontSize={18} m={1}>
          Top Communities
        </Box>
        <ul class="list-group list-group-flush">
          {data.map((row, index) => {
            return (
              <li key={index} class="list-group-item">
                <TopCommunitiesRow data={row} />
              </li>
            );
          })}
        </ul>
      </div>
    // </div>
  );
}
