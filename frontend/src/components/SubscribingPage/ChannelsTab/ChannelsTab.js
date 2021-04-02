import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Api from "../../../helpers/Api";
import SubscribingCard from "./SubscribingCard";
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

  const [subscribingList, setSubscribingList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser);
    }
  }, [currentUser]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function loadData(currentUser) {
    Api.getSubscriptions(currentUser)
      .done((data) => {
        setSubscribingList(data);
        console.log(subscribingList);
      })
      .fail((xhr, status, error) => {
        if ((xhr, status, error === "Cannot find person")) {
          alert.show("You are not logged in");
        } else if ((xhr, status, error === "Missing person id")) {
          alert.show("The person ID is missing");
        }
      });
  }

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
          Users subscribed ({subscribingList.length})
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
        <SubscribingCard
          subscribingList={subscribingList}
          searchTerm={searchTerm}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
