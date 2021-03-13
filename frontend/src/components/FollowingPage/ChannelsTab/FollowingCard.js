import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, Box } from "@material-ui/core";
import FollowingCardItem from "./FollowingCardItem";
import ChannelRow from "./ChannelRow";

const useStyles = makeStyles({
  followingList: {
    display: "flex",
    flexWrap: "wrap",
    overflow: "auto",
  },
  noFollowersText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    color: "grey",
  },
});

export default function FollowingCard({
  followingList,
  searchTerm,
  currentUser,
}) {
  const styles = useStyles();

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    console.log(followingList);
    const results = followingList.filter((channel) =>
      channel["publisher"].username.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [followingList, searchTerm]);

  return followingList && followingList.length > 0 ? (
    searchResults.length > 0 ? (
      <GridList
        cols={4}
        className={styles.subscribingList}
        style={{
          justifyContent: "flex-start",
        }}
      >
        {searchResults.map((data, idx) => (
          <FollowingCardItem
            key={idx}
            follow={data}
            currentUser={currentUser}
          />
        ))}
      </GridList>
    ) : (
      <Box className={styles.noFollowersText}>
        <p>No results for '{searchTerm}'</p>
      </Box>
    )
  ) : (
    <Box className={styles.noFollowersText}>
      <p>You do not follow any channels!</p>
    </Box>
  );
}

/*
followingList !== undefined ? (
    <div className="card card-primary">
      <div className="card-body">
        <dl>
          <dt className="font-weight-bold" class="text-large">
            Channels you follow
          </dt>
          <dd className="font-weight-normal">
            {" "}
            You follow {followingList.length} channels
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
  ) : (
    ""
  );
*/
