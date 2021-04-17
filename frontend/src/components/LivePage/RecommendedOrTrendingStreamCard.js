import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, Box } from "@material-ui/core";
import LiveStreamCardItem from "./LiveStreamCardItem";

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

export default function RecommendedOrTrendingStreamCard({
  streamList,
  searchTerm,
}) {
  const styles = useStyles();

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    let results = streamList.filter((stream) =>
      stream.title.toLowerCase().includes(searchTerm)
    );
    if (results.length > 4) {
      results = results.slice(0, 4);
    }
    setSearchResults(results);
  }, [streamList, searchTerm]);

  return streamList && streamList.length > 0 ? (
    searchResults.length > 0 ? (
      <GridList
        col={4}
        className={styles.streamList}
        style={{
          justifyContent: "flex-start",
        }}
      >
        {searchResults.map((data, idx) => (
          <LiveStreamCardItem key={idx} stream={data} />
        ))}
      </GridList>
    ) : (
      <Box className={styles.noStreamsText}>
        <p>No results for '{searchTerm}'</p>
      </Box>
    )
  ) : (
    ""
  );
}
