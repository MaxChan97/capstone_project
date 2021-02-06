import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, IconButton, Paper } from "@material-ui/core";
import searchLogo from "../../assets/Search logo.svg";

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

export default function SearchCard() {
  const classes = useStyles();
  const [searchString, setSearchString] = useState("");
  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="card card-primary mx-2">
      <div className="card-body">
        <p className="font-weight-normal">
          Search in <b>React is Fun</b>
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
        <p className="font-weight-normal my-3">
          A community for all ages and experience levels to learn React code in
          a fun and colaborative way!
        </p>
        <p className="font-weight-light">
          <i class="fas fa-users"></i> 8.9K members
        </p>
        <p className="font-weight-light">
          <i class="fas fa-birthday-cake"></i> Created 3 January 2021
        </p>
      </div>
    </div>
  );
}
