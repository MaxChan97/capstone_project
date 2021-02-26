import React from "react";
import FollowerRow from "./FollowerRow";

export default function FollowerCard({ followerList }) {
  return (
    followerList !== undefined ? (
    <div className="card card-primary">
      <div className="card-body">
        <p className="font-weight-bold">Followers</p>

          <p className="font-weight-light"> Number of followers: {followerList.length}</p>
        
        <ul class="list-group list-group-flush">
          {followerList.map((row, index) => {
            return (
              <li key={index} class="list-group-item">
                <FollowerRow follower={row} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  ) : (""))
}
