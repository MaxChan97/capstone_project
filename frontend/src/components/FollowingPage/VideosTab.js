import React, { useState, useEffect } from "react";
import Api from "../../helpers/Api";
import { useSelector } from "react-redux";
import VideoCard from "../VideosPage/VideoCard";

export default function VideosTab() {
  const currentUser = useSelector((state) => state.currentUser);

  const [videoOffset, setVideoOffset] = useState(1);
  const [videoResults, setVideoResults] = useState([]);
  const [videoPaginatedResults, setVideoPaginatedResults] = useState([]);
  const [videoPageCount, setVideoPageCount] = useState(0);

  useEffect(() => {
    let allVideos = [];
    Api.getFollowing(currentUser).then((personObjects) => {
      (async () => {
        for (var i = 0; i < personObjects.length; i++) {
          let videos = await Api.getPersonsVideos(personObjects[i].id);
          allVideos = allVideos.concat(videos);
        }

        for (var i = allVideos.length - 1; i >= 0; i--) {
          if (allVideos[i].isPaid === true) {
            let subscriptionStatus = await Api.isSubscribed(
              currentUser,
              allVideos[i].author.id
            );
            if (
              subscriptionStatus.subscriptionStatus === "NotSubscribed" &&
              allVideos[i].author.id !== currentUser
            ) {
              allVideos.splice(i, 1);
            }
          }
        }

        setVideoResults(allVideos.reverse());
        setVideoPageCount(Math.ceil(allVideos.length / 16));
      })();
    });
  }, []);

  useEffect(() => {
    const slice = videoResults.slice(
      (videoOffset - 1) * 16,
      (videoOffset - 1) * 16 + 16
    );
    setVideoPaginatedResults(slice);
  }, [videoOffset, videoResults]);

  const handleVideoPageClick = (e) => {
    const selectedPage = e.selected;
    setVideoOffset(selectedPage + 1);
  };

  return (
    <div
      style={{ paddingTop: "10px", paddingLeft: "28px", paddingRight: "28px" }}
    >
      <VideoCard
        videoList={videoPaginatedResults}
        videoPageCount={videoPageCount}
        handleVideoPageClick={handleVideoPageClick}
      />
    </div>
  );
}
