import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, Box } from "@material-ui/core";
import SubscribingCardItem from "./SubscribingCardItem";
import ChannelRow from "./ChannelRow";

const useStyles = makeStyles({
  subscribingList: {
    display: "flex",
    flexWrap: "wrap",
    overflow: "auto",
  },
  noSubscribersText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    color: "grey",
  },
});

export default function SubscribingCard({
  subscribingList,
  searchTerm,
  currentUser,
}) {
  const styles = useStyles();

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const results = subscribingList.filter((channel) =>
      channel["publisher"].username.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [subscribingList, searchTerm]);

  return subscribingList && subscribingList.length > 0 ? (
    searchResults.length > 0 ? (
      <GridList
        cols={4}
        className={styles.subscribingList}
        style={{
          justifyContent: "flex-start",
        }}
      >
        {searchResults.map((data, idx) => (
          <SubscribingCardItem
            key={idx}
            subscribe={data}
            currentUser={currentUser}
          />
        ))}
      </GridList>
    ) : (
      <Box className={styles.noSubscribersText}>
        <p>No results for '{searchTerm}'</p>
      </Box>
    )
  ) : (
    <Box className={styles.noSubscribersText}>
      <p>You are not subscribed to any users!</p>
    </Box>
  );
}
/*
<div className="card card-primary">
      <div className="card-body">
        <dl>
          <dt className="font-weight-bold" class="text-large">
            Channels you subscribe to
          </dt>
          <dd className="font-weight-normal">
            {" "}
            You subscribe to {subscribingList.length} channels
          </dd>
        </dl>
        <ul class="list-group list-group-flush">
          {searchResults.map((row, index) => {
            return (
              <li key={index} class="list-group-item">
                <ChannelRow channel={row} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
    */
