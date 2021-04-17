import React from "react";
import MyCommunitiesRowForFeed from "./MyCommunitiesRowForFeed";
import { Link } from "react-router-dom";

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
        {communityList.map((row, index) => {
          return <MyCommunitiesRowForFeed key={index} community={row} />;
        })}
        <Link to={"/myCommunities"}>
          <p
            style={{
              color: "#3B21CB",
              fontWeight: "600",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            See More
          </p>
        </Link>
      </div>
    </div>
  ) : null;
}
