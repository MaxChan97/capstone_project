import React, { useEffect, useState } from "react";
import Api from "../../helpers/Api";
import { useSelector } from "react-redux";
import LiveStreamCard from "../LivePage/LiveStreamCard";

export default function VideosTab({ personId, refresh, setRefresh }) {
  const currentUser = useSelector((state) => state.currentUser);

  const [perPage] = useState(16);
  const [streamList, setStreamList] = useState([]);
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

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
  }

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
    </div>
  );
}
