import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ProfilePostCard from "../../components/ProfilePage/ProfilePostCard";
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

export default function PostListOfFollowing() {
  const classes = useStyles();
  const alert = useAlert();
  const currentUser = useSelector((state) => state.currentUser);
  const [dataList, setDataList] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser);
    }
  }, [currentUser, refresh]);

  function loadData(currentUser) {
    Api.getFollowingPosts(currentUser)
      .done((postList) => {
        setDataList(postList);
      })
      .fail(() => {
        alert.show("Unable to load posts!");
      });
  }

  return dataList && dataList.length > 0 ? (
    <List className={classes.root} style={{ paddingTop: 0 }}>
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
    <div style={{ marginTop: "30px" }}>
      <h3
        style={{
          color: "gray",
          textAlign: "center",
          margin: "auto",
        }}
      >
        No posts yet...
      </h3>
      <p
        style={{
          color: "gray",
          textAlign: "center",
          margin: "auto",
        }}
      >
        Follow someone to view their posts here!
      </p>
      <br></br>
      <div
        style={{
          textAlign: "center",
          margin: "auto",
        }}
      >
        <img src={Talk} />
      </div>
    </div>
  );
}
