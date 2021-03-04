import React from "react";
import SearchCommunityResultRow from "./SearchCommunityResultRow";

export default function SearchCommunityResultList({ communityList }) {
  return communityList !== undefined ? (
    <div className="card card-primary">
      <div className="card-body">
        {communityList.length != 0 ? (
          <ul class="list-group list-group-flush">
            {communityList.map((row, index) => {
              return (
                <li key={index} class="list-group-item">
                  <SearchCommunityResultRow community={row} />
                </li>
              );
            })}
          </ul>
        ) : (
          <div>
            <h3
              style={{
                color: "gray",
                textAlign: "center",
                margin: "auto",
              }}
            >
              No communities found
            </h3>
          </div>
        )}
      </div>
    </div>
  ) : null;
}
