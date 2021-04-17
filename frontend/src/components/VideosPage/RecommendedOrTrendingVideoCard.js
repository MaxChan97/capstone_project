import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, Box } from "@material-ui/core";
import VideoCardItem from "./VideoCardItem";

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

export default function RecommendedOrTrendingStreamCard({ videoList }) {
  const styles = useStyles();

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    let results = videoList;
    if (results.length > 4) {
      results = results.slice(0, 4);
    }
    setSearchResults(results);
  }, [videoList]);

  return videoList && videoList.length > 0 ? (
    searchResults.length > 0 ? (
      <GridList
        col={4}
        className={styles.streamList}
        style={{
          justifyContent: "flex-start",
        }}
      >
        {searchResults.map((data, idx) => (
          <VideoCardItem key={idx} video={data} />
        ))}
      </GridList>
    ) : (
      <Box className={styles.noStreamsText}>
        <p>No results for ''</p>
      </Box>
    )
  ) : (
    ""
  );
}
