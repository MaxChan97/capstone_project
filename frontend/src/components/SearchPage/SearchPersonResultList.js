import React from "react";
import SearchPersonResultRow from "./SearchPersonResultRow";

export default function SearchPersonResultList({ personList }) {
  return personList !== undefined ? (
    <div className="card card-primary">
      <div className="card-body">
        {personList.length != 0 ? (
          <ul class="list-group list-group-flush">
            {personList.map((row, index) => {
              return (
                <li key={index} class="list-group-item">
                  <SearchPersonResultRow person={row} />
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
              No channels found
            </h3>
          </div>
        )}
      </div>
    </div>
  ) : null;
}
