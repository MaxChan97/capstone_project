import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import VideoCard from "../components/VideosPage/VideoCard";
import Api from "../helpers/Api";
import { Box } from "@material-ui/core";

const useStyles = makeStyles({
  videoList: {
    display: "flex",
    flexWrap: "wrap",
    overflow: "auto",
  },
  noVideosText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    color: "grey",
  },
});

export default function RecommendedVideosPage() {
  const currentUser = useSelector((state) => state.currentUser);
  const styles = useStyles();

  const [recommendedVideoList, setRecommendedVideoList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    Api.getPersonById(currentUser).then((person) => {
      Api.getAllVideos().then((videos) => {
        (async () => {
          for (var i = videos.length - 1; i >= 0; i--) {
            if (videos[i].isPaid === true) {
              let subscriptionStatus = await Api.isSubscribed(
                currentUser,
                videos[i].author.id
              );
              if (
                subscriptionStatus.subscriptionStatus === "NotSubscribed" &&
                videos[i].author.id !== currentUser
              ) {
                videos.splice(i, 1);
              }
            }
          }

          let recommendedVideos = [];
          for (var i = videos.length - 1; i >= 0; i--) {
            if (
              person.topicInterests.some((interest) =>
                videos[i].relatedTopics.includes(interest)
              )
            ) {
              recommendedVideos.push(videos[i]);
              videos.splice(i, 1);
            }
          }

          setRecommendedVideoList(recommendedVideos);
        })();
      });
    });
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
          Recommended videos For You
        </h3>
        <div style={{ paddingTop: "20px" }}>
          {recommendedVideoList.length > 0 ? (
            <VideoCard
              videoList={recommendedVideoList}
              videoPageCount={1}
              handleVideoPageClick={() => {}}
            />
          ) : (
            <Box className={styles.noVideosText}>
              <p>No recommended videos!</p>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}
