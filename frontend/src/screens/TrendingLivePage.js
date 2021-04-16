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

export default function TrendingLivePage() {
  const currentUser = useSelector((state) => state.currentUser);
  const styles = useStyles();

  const [trendingStreamList, setTrendingStreamList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    Api.getTopTrends()
      .then((topTrends) => {
        Api.getTodaysTrends()
          .then((todayTrends) => {
            Api.getOngoingStreams()
              .then((streams) => {
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
                setTrendingStreamList(trendingStreams);
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
          Trending streams
        </h3>
        <div style={{ paddingTop: "20px" }}>
          {trendingStreamList.length > 0 ? (
            <LiveStreamCard
              streamList={trendingStreamList}
              searchTerm={searchTerm}
            />
          ) : (
            <Box className={styles.noStreamsText}>
              <p>No trending streams!</p>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}
