import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ReplyCard from "./ReplyCard";
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

export default function ReplyList({repliesData, refresh, setRefresh }) {
  const classes = useStyles();
  const alert = useAlert();


  function loadData(personId) {
    //REPLACE WITH API
    /*
  Api.getPersonsPost(personId)
    .done((postList) => {
      postList.reverse();
      setDataList(postList);
    })
    .fail(() => {
      alert.show("Unable to load posts!");
    });
    */
  }

  return repliesData? (
    <List className={classes.root}>
      {repliesData.map((data) => (
        <div>
          <ListItem alignItems="flex-start">
            <ReplyCard key={data.id} data={data} refresh={refresh}
                setRefresh={setRefresh} />
          </ListItem>
        </div>
      ))}
    </List>
  ) : (
      <p></p>
    );
}
