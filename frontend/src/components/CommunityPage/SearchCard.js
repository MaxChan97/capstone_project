import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, IconButton, Paper } from "@material-ui/core";
import searchLogo from "../../assets/Search logo.svg";
import * as dayjs from "dayjs";
import { useAlert } from "react-alert";
import Api from "../../helpers/Api";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#EAECEF",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function SearchCard({ searchString, setSearchString }) {
  const classes = useStyles();
  const currentUser = useSelector((state) => state.currentUser);
  const { communityId } = useParams();
  const alert = useAlert();

  const [currentCommunity, setCurrentCommunity] = useState({});

  useEffect(() => {
    if (currentUser) {
      loadData(communityId);
    }
  }, [communityId]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function loadData(communityId) {
    Api.getCommunityById(communityId, currentUser)
      .done((currentCommunity) => {
        console.log(currentCommunity);
        setCurrentCommunity(currentCommunity);
      })
      .fail((xhr, status, error) => {
        alert.show("This community does not exist!");
      });
  }

  return (
    <div className="card card-primary mx-2 mt-3">
      <div className="card-body">
        <p className="font-weight-normal">
          Search in <b>{currentCommunity.name}</b>
        </p>
        <div className="my-3">
          <Paper component="form" className={classes.root}>
            <InputBase
              value={searchString}
              className={classes.input}
              placeholder="Search in this community"
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
            />
            <IconButton
              style={{ outline: "none" }}
              className={classes.iconButton}
              aria-label="search"
            >
              <img src={searchLogo} alt="searchLogo" />
            </IconButton>
          </Paper>
        </div>

        <div class="dropdown my-5">
          Sort by &nbsp;&nbsp;&nbsp;
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Top
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <a class="dropdown-item" href="#">
                Action
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                Another action
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                Something else here
              </a>
            </li>
          </ul>
        </div>
        {/*<p className="font-weight-light">
          <i class="fas fa-users"></i>{" "}
          {currentCommunity.members !== undefined
            ? currentCommunity.members.length !== 1
              ? currentCommunity.members.length + " Members"
              : currentCommunity.members.length + " Member"
            : null}
          </p>*/}
        <p className="font-weight-light">
          <i class="fas fa-birthday-cake"></i> Created{" "}
          {currentCommunity.dateCreated !== undefined
            ? dayjs(currentCommunity.dateCreated.slice(0, -5)).format(
                "DD MMMM YYYY"
              )
            : null}
        </p>
      </div>
    </div>
  );
}
