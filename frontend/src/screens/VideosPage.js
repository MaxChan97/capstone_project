import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";
import RecommendedOrTrendingVideoCard from "../components/VideosPage/RecommendedOrTrendingVideoCard";
import VideoCard from "../components/VideosPage/VideoCard";

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

export default function VideosPage() {
  const currentUser = useSelector((state) => state.currentUser);
  const styles = useStyles();
  const alert = useAlert();

  const [perPage] = useState(16);
  const [recommendedVideoList, setRecommendedVideoList] = useState([]);
  const [trendingVideoList, setTrendingVideoList] = useState([]);

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
    Api.getPersonById(currentUser)
      .then((person) => {
        Api.getTopTrends()
          .then((topTrends) => {
            Api.getTodaysTrends()
              .then((todayTrends) => {
                Api.getAllVideos()
                  .then((videos) => {
                    (async () => {
                      for (var i = videos.length - 1; i >= 0; i--) {
                        if (videos[i].isPaid === true) {
                          let subscriptionStatus = await Api.isSubscribed(
                            currentUser,
                            videos[i].author.id
                          );
                          if (
                            subscriptionStatus.subscriptionStatus ===
                              "NotSubscribed" &&
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
                      setRecommendedVideoList(recommendedVideos);
                      setTrendingVideoList(trendingVideos);

                      setVideoResults(videos.reverse());
                      setVideoPageCount(Math.ceil(videos.length / perPage));
                    })();
                  })
                  .fail((xhr, status, error) => {});
              })
              .fail((xhr, status, error) => {});
          })
          .fail((xhr, status, error) => {});
      })
      .fail((xhr, status, error) => {});
  }

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function renderRecommendedForYou() {
    if (recommendedVideoList != undefined && recommendedVideoList.length > 0) {
      return (
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h5
              style={{ textAlign: "left", margin: "0px", fontWeight: "bold" }}
            >
              Recommended For You
            </h5>

            <Link style={{ color: "inherit" }}>
              <p
                style={{
                  color: "#6E757C",
                  margin: "0px",
                  marginLeft: "10px",
                }}
              >
                View All
              </p>
            </Link>
          </div>
          <div style={{ paddingTop: "20px" }}>
            <RecommendedOrTrendingVideoCard videoList={recommendedVideoList} />
          </div>
          <div
            style={{
              borderTop: "1px solid #D3D2D2",
            }}
          ></div>
        </div>
      );
    }
  }

  function renderTrending() {
    if (trendingVideoList != undefined && trendingVideoList.length > 0) {
      return (
        <div>
          <div style={{ marginTop: "10px" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <h5
                style={{ textAlign: "left", margin: "0px", fontWeight: "bold" }}
              >
                Trending
              </h5>
              <Link style={{ color: "inherit" }}>
                <p
                  style={{
                    color: "#6E757C",
                    margin: "0px",
                    marginLeft: "10px",
                  }}
                >
                  View All
                </p>
              </Link>
            </div>
            <div style={{ paddingTop: "20px" }}>
              <RecommendedOrTrendingVideoCard videoList={trendingVideoList} />
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid #D3D2D2",
            }}
          ></div>
        </div>
      );
    }
  }

  function renderOtherVideos() {
    if (
      videoPaginatedResults != undefined &&
      videoPaginatedResults.length > 0
    ) {
      return (
        <div>
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
  }

  const handleVideoPageClick = (e) => {
    const selectedPage = e.selected;
    setVideoOffset(selectedPage + 1);
  };

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
          Videos
        </h3>
        {recommendedVideoList.length != 0 ||
        trendingVideoList.length != 0 ||
        videoPaginatedResults.length != 0 ? (
          <div>
            {renderRecommendedForYou()}
            {renderTrending()}
            {renderOtherVideos()}
          </div>
        ) : (
          <Box className={styles.noVideosText}>
            <p>No videos!</p>
          </Box>
        )}
      </div>
    </div>
  );
}
