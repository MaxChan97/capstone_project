import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ProfilePostCard from "./ProfilePostCard";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";
import Talk from "../../assets/talk1.gif";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "auto",
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
          
            <ProfilePostCard
              key={data.id}
              data={data}
              refresh={refresh}
              setRefresh={setRefresh}
            />
      
        </div>
      ))}
    </List>
  ) : (
    <div style={{ marginTop: "40px" }}>
      <h3
        style={{
          color: "gray",
          textAlign: "center",
          margin: "auto",
        }}
      >
        No posts yet...
      </h3>
      <br></br>
      <div
        style={{
          textAlign: "center",
          margin: "auto",
        }}>
        <img src={Talk} />
      </div>
    </div>
  );
}
