import React from "react";
import MyCommunitiesRowForFeed from "./MyCommunitiesRowForFeed";

export default function MyCommunitiesCardForFeed({ communityList }) {
  return communityList !== undefined ? (
    <div className="card card-primary">
      <div className="card-body">
        <p
          style={{
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          My Communities
        </p>
        <ul class="list-group list-group-flush">
          {communityList.map((row, index) => {
            return (
              <li key={index} class="list-group-item">
                <MyCommunitiesRowForFeed community={row} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  ) : null;
}
