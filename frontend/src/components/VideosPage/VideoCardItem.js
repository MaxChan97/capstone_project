import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Card, Box, CardContent, Button } from "@material-ui/core";
import defaultDP from "../../assets/Default Dp logo.svg";
import VideoThumbnail from "react-video-thumbnail";

const useStyles = makeStyles({
  root: {
    height: "auto",
    width: `${92 / 4}%`,
    textAlign: "start",
    marginLeft: "1%",
    marginRight: "1%",
    marginBottom: "1.2%",
    backgroundColor: "inherit",
    border: "none",
    boxShadow: "none",
    borderRadius: 0,
  },
  mainText: {
    fontSize: 16,
    margin: "0px",
    fontWeight: "bold",
    lineHeight: 1,
  },
  subText: {
    fontSize: 15,
    color: "gray",
    margin: "0px",
    lineHeight: 1,
  },
  username: {
    fontSize: 15,
    color: "gray",
    "&:hover": {
      color: "#3B21CB",
    },
    margin: "0px",
    lineHeight: 1,
  },
});

export default function VideoCardItem({ video }) {
  const styles = useStyles();

  function renderVideoTitle() {
    if (video.title.length < 48) {
      return <p className={styles.mainText}>{video.title}</p>;
    } else {
      var placeholder = video.title.slice(0, 48) + "...";
      return <p className={styles.mainText}>{placeholder}</p>;
    }
  }

  return (
    <Card className={styles.root}>
      <Link style={{ color: "inherit" }}>
        <CardContent style={{ padding: "0" }}>
          <Box
            display="flex"
            flexDirection="column"
            boxShadow={0}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/*<VideoThumbnail
              videoUrl={video.fileUrl}
              snapshotAtTime={0}
              width={250}
              height={188}
            />*/}
            <video
              width="100%"
              height={158}
              class="clip-thumbnail"
              src={video.fileUrl}
              style={{ paddingTop: "0px" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingTop: "10px",
              }}
            >
              <Link
                to={"/profile/" + video.author.id}
                style={{
                  height: "38px",
                  width: "38px",
                  display: "inline-block",
                }}
              >
                <img
                  className="img-fluid rounded-circle"
                  style={{ height: "38px", width: "38px" }}
                  src={video.author.profilePicture || defaultDP}
                />
              </Link>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: "10px",
                }}
              >
                {renderVideoTitle()}

                <Link
                  to={"/profile/" + video.author.id}
                  style={{ display: "inherit" }}
                >
                  <p
                    style={{
                      display: "inline-block",
                      marginTop: "5px",
                    }}
                    className={styles.username}
                  >
                    {video.author.username}
                  </p>
                </Link>

                <p className={styles.subText}>{video.noOfViews} Views</p>
              </div>
            </div>
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
}
