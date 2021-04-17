import React, { useEffect, useState } from "react";
import Api from "../../helpers/Api";
import { useSelector } from "react-redux";
import LiveStreamCard from "../LivePage/LiveStreamCard";
import VideoCard from "../VideosPage/VideoCard";

export default function VideosTab({ personId, refresh, setRefresh }) {
  const currentUser = useSelector((state) => state.currentUser);

  const [perPage] = useState(8);
  const [streamList, setStreamList] = useState([]);
  const [videoOffset, setVideoOffset] = useState(1);
  const [videoResults, setVideoResults] = useState([]);
  const [videoPaginatedResults, setVideoPaginatedResults] = useState([]);
  const [videoPageCount, setVideoPageCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const slice = videoResults.slice(
      (videoOffset - 1) * perPage,
      (videoOffset - 1) * perPage + perPage
    );
    setVideoPaginatedResults(slice);
  }, [videoOffset, videoResults]);

  function loadData() {
    Api.getPersonOngoingStreams(personId)
      .then((streams) => {
        (async () => {
          // take out all the streams where streamer set subscriptionOnly and currentuser not a subscriber
          for (var i = streams.length - 1; i >= 0; i--) {
            if (streams[i].isPaid === true) {
              // check if current user is subscribed
              let subscriptionStatus = await Api.isSubscribed(
                currentUser,
                streams[i].streamer.id
              );
              console.log(subscriptionStatus);
              if (subscriptionStatus.subscriptionStatus === "NotSubscribed") {
                streams.splice(i, 1);
              }
            }
          }

          setStreamList(streams);
        })();
      })
      .fail((xhr, status, error) => {});

    Api.getPersonsVideos(personId)
      .then((videos) => {
        (async () => {
          if (personId != currentUser) {
            for (var i = videos.length - 1; i >= 0; i--) {
              if (videos[i].isPaid === true) {
                let subscriptionStatus = await Api.isSubscribed(
                  currentUser,
                  videos[i].author.id
                );
                if (subscriptionStatus.subscriptionStatus === "NotSubscribed") {
                  videos.splice(i, 1);
                }
              }
            }
          }

          setVideoResults(videos.reverse());
          setVideoPageCount(Math.ceil(videos.length / perPage));
        })();
      })
      .fail((xhr, status, error) => {});
  }

  const handleVideoPageClick = (e) => {
    const selectedPage = e.selected;
    setVideoOffset(selectedPage + 1);
  };

  return (
    <div
      style={{
        paddingTop: "18px",
        paddingLeft: "28px",
        paddingRight: "28px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {streamList.length > 0 ? (
        <div>
          <h5 style={{ textAlign: "left", margin: "0px", fontWeight: "bold" }}>
            Live Now
          </h5>
          <div style={{ paddingTop: "20px" }}>
            <LiveStreamCard
              streamList={streamList}
              streamPageCount={1}
              handleStreamPageClick={() => {}}
            />
          </div>
          <div
            style={{
              borderTop: "1px solid #D3D2D2",
              marginBottom: "10px",
            }}
          ></div>
        </div>
      ) : (
        ""
      )}

      <h5 style={{ textAlign: "left", margin: "0px", fontWeight: "bold" }}>
        Videos
      </h5>
      <div style={{ paddingTop: "20px" }}>
        <VideoCard
          videoList={videoPaginatedResults}
          videoPageCount={videoPageCount}
          handleVideoPageClick={handleVideoPageClick}
        />
      </div>
    </div>
  );
}
