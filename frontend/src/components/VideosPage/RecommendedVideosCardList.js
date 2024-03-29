import React from "react";
import RecommendedVideoCardItem from "./RecommendedVideoCardItem";

export default function RecommendedVideosCardList({ videos }) {
  return (
    <div className="container pl-5">
      {videos && videos.length > 0 && (
        <div>
          <h5 className="font-weight-bold">Recommended videos</h5>
          {videos.map((video, index) => {
            return <RecommendedVideoCardItem key={index} video={video} />;
          })}
        </div>
      )}
    </div>
  );
}
