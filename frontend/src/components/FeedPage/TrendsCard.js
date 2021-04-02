import React from "react";

export default function TrendsCard({ data }) {
  return (
    data && (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title font-weight-bold">Trends</h5>
          <p className="card-text"></p>
        </div>
        <ul className="list-group list-group-flush">
          {data &&
            data.map((trend, index) => {
              return (
                <li key={index} className="list-group-item">
                  <p className="text-muted m-0">Trending in Singapore</p>
                  <p className="font-weight-bold m-0">{trend.hashtag}</p>
                  <p className="text-muted m-0">{trend.count} Tweets</p>
                </li>
              );
            })}
        </ul>
      </div>
    )
  );
}
