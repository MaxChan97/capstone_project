import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, Box } from "@material-ui/core";

const useStyles = makeStyles({
  videoList: {
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

export default function VideoCard({ video }) {
  const styles = useStyles();

  return (
    <GridList
      col={4}
      className={styles.videoList}
      style={{
        justifyContent: "flex-start",
      }}
    ></GridList>
  );
}
