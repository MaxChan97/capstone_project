import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import CommunityPostCard from "./CommunityPostCard";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "86ch",
    margin: "auto",
  },
  inline: {
    display: "inline",
  },
}));

export default function PostListOfFollowing() {
  const classes = useStyles();
  const alert = useAlert();

  const [dataList, setDataList] = useState([]);
  const currentUser = useSelector((state) => state.currentUser);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser);
    }
  }, [currentUser, refresh]);

  function loadData(currentUser) {
    Api.getFollowingCommunityPosts(currentUser)
      .done((postList) => {
        setDataList(postList);
      })
      .fail(() => {
        alert.show("Unable to load posts!");
      });
  }

  return dataList && dataList.length > 0 ? (
    <List className={classes.root}>
      {dataList.map((data) => (
        <div>
          <ListItem alignItems="flex-start">
            <CommunityPostCard
              key={data.id}
              data={data}
              refresh={refresh}
              setRefresh={setRefresh}
              community={data.postCommunity}
            />
          </ListItem>
        </div>
      ))}
    </List>
  ) : (
    <div style={{marginTop: "30px"}}>
      <h3
        style={{
          color: "gray",
          textAlign: "center",
          margin: "auto",
        }}
      >
        No posts yet...
      </h3>
    </div>
  );
}
