import React, { useState } from "react";

export default function TrendsCard({ topTrends, todaysTrends }) {
  const isInTopTrends = (hashtag) => {
    for (let trend in topTrends) {
      if (trend.hashtag === hashtag) {
        return true;
      }
    }
    return false;
  };

  return (
    topTrends &&
    topTrends.length > 0 && (
      <div className="card" style={{ width: "68%" }}>
        <div className="card-body">
          <h5 className="card-title font-weight-bold">Trends</h5>
          <p className="card-text"></p>
        </div>
        <ul className="list-group list-group-flush">
          {topTrends &&
            topTrends.map((trend, index) => {
              return (
                <a
                  href={"/trend/" + trend.hashtag.slice(1)}
                  key={index}
                  className="list-group-item list-group-item-action"
                >
                  <p className="text-muted m-0">Trending in Singapore</p>
                  <p className="font-weight-bold m-0">{trend.hashtag}</p>
                  <p className="text-muted m-0">{trend.count} mentions</p>
                </a>
              );
            })}
          {todaysTrends &&
            todaysTrends.map((trend, index) => {
              return (
                isInTopTrends(trend.hashtag) && (
                  <a
                    href={"/trend/" + trend.hashtag.slice(1)}
                    key={index}
                    className="list-group-item list-group-item-action"
                  >
                    <p className="text-muted m-0">Trending today</p>
                    <p className="font-weight-bold m-0">{trend.hashtag}</p>
                    <p className="text-muted m-0">{trend.count} mentions</p>
                  </a>
                )
              );
            })}
        </ul>
      </div>
    )
  );
}
