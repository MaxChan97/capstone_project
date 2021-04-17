import React, { useState, useEffect } from "react";
import Api from "../../helpers/Api";
import { useSelector } from "react-redux";
import LiveStreamCard from "../LivePage/LiveStreamCard";

export default function LiveTab() {
  const currentUser = useSelector((state) => state.currentUser);

  const [streamOffset, setStreamOffset] = useState(1);
  const [streamResults, setStreamResults] = useState([]);
  const [streamPaginatedResults, setStreamPaginatedResults] = useState([]);
  const [streamPageCount, setStreamPageCount] = useState(0);

  useEffect(() => {
    let allStreams = [];
    Api.getSubscriptions(currentUser).then((subscriptionObjects) => {
      (async () => {
        console.log(subscriptionObjects);
        for (var i = 0; i < subscriptionObjects.length; i++) {
          let streams = await Api.getPersonOngoingStreams(
            subscriptionObjects[i].publisher.id
          );
          allStreams = allStreams.concat(streams);
        }

        for (var i = allStreams.length - 1; i >= 0; i--) {
          if (allStreams[i].isPaid === true) {
            let subscriptionStatus = await Api.isSubscribed(
              currentUser,
              allStreams[i].streamer.id
            );
            if (
              subscriptionStatus.subscriptionStatus === "NotSubscribed" &&
              allStreams[i].streamer.id !== currentUser
            ) {
              allStreams.splice(i, 1);
            }
          }
        }

        setStreamResults(allStreams.reverse());
        setStreamPageCount(Math.ceil(allStreams.length / 16));
      })();
    });
  }, []);

  useEffect(() => {
    const slice = streamResults.slice(
      (streamOffset - 1) * 16,
      (streamOffset - 1) * 16 + 16
    );
    setStreamPaginatedResults(slice);
  }, [streamOffset, streamResults]);

  const handleStreamPageClick = (e) => {
    const selectedPage = e.selected;
    setStreamOffset(selectedPage + 1);
  };

  return (
    <div
      style={{ paddingTop: "10px", paddingLeft: "28px", paddingRight: "28px" }}
    >
      <LiveStreamCard
        streamList={streamPaginatedResults}
        streamPageCount={streamPageCount}
        handleStreamPageClick={handleStreamPageClick}
      />
    </div>
  );
}
