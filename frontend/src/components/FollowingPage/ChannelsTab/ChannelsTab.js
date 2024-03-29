import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Api from "../../../helpers/Api";
import FollowingCard from "./FollowingCard";
import SearchCard from "./SearchCard";
import { InputBase, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  input: {
    backgroundColor: "#EAECEF",
  },
  inputDiv: {
    padding: "2px 12px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#EAECEF",
  },
}));

export default function ChannelsTab() {
  const classes = useStyles();

  // const [currentPerson, setCurrentPerson] = useState({});

  const [followingList, setFollowingList] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);

  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser);
      console.log(currentUser);
    }
  }, [currentUser]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function loadData(currentUser) {
    Api.getFollowing(currentUser)
      .done((data) => {
        setFollowingList(data);
        console.log(followingList);
      })
      .fail((xhr, status, error) => {
        if ((xhr, status, error === "Cannot find person")) {
          alert.show("You are not logged in");
        } else if ((xhr, status, error === "Missing person id")) {
          alert.show("The person ID is missing");
        }
      });
  }

  // function toTitleCase(str) {
  //     var i,
  //         frags = str.split("_");
  //     for (i = 0; i < frags.length; i++) {
  //         frags[i] =
  //             frags[i].charAt(0).toUpperCase() + frags[i].substr(1).toLowerCase();
  //     }
  //     return frags.join(" ");
  // }

  return (
    <div style={{ paddingLeft: "2.5%", paddingRight: "2.5%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h4 style={{ fontWeight: "bold" }}>
          Users followed ({followingList.length})
        </h4>
        <Paper component="form" className={classes.inputDiv}>
          <InputBase
            color="secondary"
            value={searchTerm}
            className={classes.input}
            placeholder="Search Users"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            fullWidth={false}
          />
        </Paper>
      </div>
      <div style={{ marginTop: "5px", paddingTop: "15px" }}>
        <FollowingCard
          followingList={followingList}
          searchTerm={searchTerm}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
/*
<div className="content-wrapper">
      <div className="row">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 mt-9" style={{ textAlign: "left" }}>
              <FollowingCard
                followingList={followingList}
                searchTerm={searchTerm}
              />
            </div>
            <div className="col-md-4 mt-9" style={{ textAlign: "left" }}>
              <SearchCard
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
*/
