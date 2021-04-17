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

export default function TrendingVideosPage() {
  const currentUser = useSelector((state) => state.currentUser);
  const styles = useStyles();

  const [trendingVideoList, setTrendingVideoList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    Api.getTopTrends().then((topTrends) => {
      Api.getTodaysTrends().then((todayTrends) => {
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

            let trendingVideos = [];
            for (var i = videos.length - 1; i >= 0; i--) {
              if (
                topTrends.some((trend) =>
                  videos[i].trends.some((videoTrend) => {
                    return videoTrend.hashTag == trend.hashtag;
                  })
                ) ||
                todayTrends.some((trend) =>
                  videos[i].trends.some((videoTrend) => {
                    return videoTrend.hashTag == trend.hashtag;
                  })
                )
              ) {
                trendingVideos.push(videos[i]);
                videos.splice(i, 1);
              }
            }

            setTrendingVideoList(trendingVideos);
          })();
        });
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
          Trending videos
        </h3>
        <div style={{ paddingTop: "20px" }}>
          {trendingVideoList.length > 0 ? (
            <VideoCard
              videoList={trendingVideoList}
              videoPageCount={1}
              handleVideoPageClick={() => {}}
            />
          ) : (
            <Box className={styles.noVideosText}>
              <p>No trending videos!</p>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}
