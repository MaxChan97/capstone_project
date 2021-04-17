import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import LiveStreamCard from "../components/LivePage/LiveStreamCard";
import Api from "../helpers/Api";
import { Box } from "@material-ui/core";

const useStyles = makeStyles({
  streamList: {
    display: "flex",
    flexWrap: "wrap",
    overflow: "auto",
  },
  noStreamsText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    color: "grey",
  },
});

export default function RecommendedLivePage() {
  const currentUser = useSelector((state) => state.currentUser);
  const styles = useStyles();

  const [recommendedStreamList, setRecommendedStreamList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    Api.getPersonById(currentUser)
      .then((person) => {
        Api.getOngoingStreams()
          .then((streams) => {
            let recommendedStreams = [];
            for (var i = streams.length - 1; i >= 0; i--) {
              if (
                person.topicInterests.some((interest) =>
                  streams[i].relatedTopics.includes(interest)
                )
              ) {
                // got match in interest
                // add to recommended streams and remove from streams
                recommendedStreams.push(streams[i]);
                streams.splice(i, 1);
              }
            }
            setRecommendedStreamList(recommendedStreams);
          })
          .fail((xhr, status, error) => {});
      })
      .fail((xhr, status, error) => {});
  }

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div
        style={{
          paddingTop: "18px",
          paddingLeft: "28px",
          paddingRight: "28px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ fontWeight: "bold", textAlign: "left", margin: "0px" }}>
          Recommended streams For You
        </h3>
        <div style={{ paddingTop: "20px" }}>
          {recommendedStreamList.length > 0 ? (
            <LiveStreamCard
              streamList={recommendedStreamList}
              searchTerm={searchTerm}
            />
          ) : (
            <Box className={styles.noStreamsText}>
              <p>No recommended streams!</p>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}
