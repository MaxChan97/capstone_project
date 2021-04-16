import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Webcam from "react-webcam";
import { logOut } from "../redux/actions/index";
import LiveStreamCard from "../components/LivePage/LiveStreamCard";
import RecommendedOrTrendingStreamCard from "../components/LivePage/RecommendedOrTrendingStreamCard";
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

export default function LivePage() {
  const currentUser = useSelector((state) => state.currentUser);
  const styles = useStyles();

  const [perPage] = useState(16);
  const [recommendedStreamList, setRecommendedStreamList] = useState([]);
  const [trendingStreamList, setTrendingStreamList] = useState([]);
  //const [streamList, setStreamList] = useState([]);
  const [streamOffset, setStreamOffset] = useState(1);
  const [streamResults, setStreamResults] = useState([]);
  const [streamPaginatedResults, setStreamPaginatedResults] = useState([]);
  const [streamPageCount, setStreamPageCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const slice = streamResults.slice(
      (streamOffset - 1) * perPage,
      (streamOffset - 1) * perPage + perPage
    );
    setStreamPaginatedResults(slice);
  }, [streamOffset, streamResults]);

  function loadData() {
    Api.getPersonById(currentUser)
      .then((person) => {
        Api.getTopTrends()
          .then((topTrends) => {
            Api.getTodaysTrends()
              .then((todayTrends) => {
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

                    let trendingStreams = [];
                    for (var i = streams.length - 1; i >= 0; i--) {
                      if (
                        topTrends.some((trend) =>
                          streams[i].trends.some((streamTrend) => {
                            return streamTrend.hashTag == trend.hashtag;
                          })
                        ) ||
                        todayTrends.some((trend) =>
                          streams[i].trends.some((streamTrend) => {
                            return streamTrend.hashTag == trend.hashtag;
                          })
                        )
                      ) {
                        // got match in trends
                        trendingStreams.push(streams[i]);
                        streams.splice(i, 1);
                      }
                    }
                    setRecommendedStreamList(recommendedStreams);
                    setTrendingStreamList(trendingStreams);

                    setStreamResults(streams);
                    setStreamPageCount(Math.ceil(streams.length / perPage));
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
    if (
      recommendedStreamList != undefined &&
      recommendedStreamList.length > 0
    ) {
      return (
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h5
              style={{ textAlign: "left", margin: "0px", fontWeight: "bold" }}
            >
              Recommended For You
            </h5>
            {recommendedStreamList.length > 4 ? (
              <Link to="/live/recommended" style={{ color: "inherit" }}>
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
            ) : (
              ""
            )}
          </div>
          <div style={{ paddingTop: "20px" }}>
            <RecommendedOrTrendingStreamCard
              streamList={recommendedStreamList}
              searchTerm={searchTerm}
            />
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
    if (trendingStreamList != undefined && trendingStreamList.length > 0) {
      return (
        <div>
          <div style={{ marginTop: "10px" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <h5
                style={{ textAlign: "left", margin: "0px", fontWeight: "bold" }}
              >
                Trending
              </h5>
              {trendingStreamList.length > 4 ? (
                <Link to="/live/trending" style={{ color: "inherit" }}>
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
              ) : (
                ""
              )}
            </div>
            <div style={{ paddingTop: "20px" }}>
              <RecommendedOrTrendingStreamCard
                streamList={trendingStreamList}
                searchTerm={searchTerm}
              />
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

  function renderOtherStreams() {
    if (
      streamPaginatedResults != undefined &&
      streamPaginatedResults.length > 0
    ) {
      return (
        <div>
          <div style={{ paddingTop: "20px" }}>
            <LiveStreamCard
              streamList={streamPaginatedResults}
              streamPageCount={streamPageCount}
              handleStreamPageClick={handleStreamPageClick}
            />
          </div>
        </div>
      );
    }
  }

  const handleStreamPageClick = (e) => {
    const selectedPage = e.selected;
    setStreamOffset(selectedPage + 1);
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
          Live Now
        </h3>
        {recommendedStreamList.length != 0 ||
        trendingStreamList.length != 0 ||
        streamPaginatedResults.length != 0 ? (
          <div>
            {renderRecommendedForYou()}
            {renderTrending()}
            {renderOtherStreams()}
          </div>
        ) : (
          <Box className={styles.noStreamsText}>
            <p>No streams!</p>
          </Box>
        )}
      </div>
    </div>
  );
}
