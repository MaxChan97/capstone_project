import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ProfilePostCard from "./ProfilePostCard";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "82ch",
  },
  inline: {
    display: "inline",
  },
}));

export default function PostList({ personId, refresh, setRefresh }) {
  const classes = useStyles();
  const alert = useAlert();

  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    if (personId) {
      loadData(personId);
    }
  }, [personId, refresh]);

  function loadData(personId) {
    Api.getPersonsPost(personId)
      .done((postList) => {
        postList.reverse();
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
            <ProfilePostCard
              key={data.id}
              data={data}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </ListItem>
        </div>
      ))}
    </List>
  ) : (
    <h3
      style={{
        color: "gray",
        textAlign: "center",
        margin: "auto",
      }}
    >
      No posts yet...
    </h3>
  );
}
