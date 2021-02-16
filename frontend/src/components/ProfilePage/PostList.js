<<<<<<< HEAD
import React from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> 85f6d7c1da298410cf14f3dac2c84fd06ef1508f
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ProfilePostCard from "./ProfilePostCard";
<<<<<<< HEAD
=======
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";
>>>>>>> 85f6d7c1da298410cf14f3dac2c84fd06ef1508f

//INCOMPLETE

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

<<<<<<< HEAD
export default function PostList({ dataList }) {
  const classes = useStyles();

=======
export default function PostList({ personId, refresh }) {
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

>>>>>>> 85f6d7c1da298410cf14f3dac2c84fd06ef1508f
  return dataList && dataList.length > 0 ? (
    <List className={classes.root}>
      {dataList.map((data) => (
        <div>
          <ListItem alignItems="flex-start">
<<<<<<< HEAD
            <ProfilePostCard key={data[0]} data={data} />
=======
            <ProfilePostCard key={data.id} data={data} />
>>>>>>> 85f6d7c1da298410cf14f3dac2c84fd06ef1508f
          </ListItem>
          <Divider variant="inset" component="li" />
        </div>
      ))}
    </List>
  ) : (
    <p>No posts yet</p>
  );
}
