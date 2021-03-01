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

export default function SearchCard( {searchTerm, setSearchTerm} ) {
  const classes = useStyles();

  return (
    <div className="card card-primary mx-2">
      <div className="card-body">
        <p className="font-weight-light">
          Search followers and subscribers
        </p>
        <div className="my-3">
          <Paper component="form" className={classes.root}>
            <InputBase
              value={searchTerm}
              className={classes.input}
              placeholder="Search users"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            {/* <IconButton
              style={{ outline: "none" }}
              className={classes.iconButton}
              aria-label="search"
            > */}
              {/* <img src={searchLogo} alt="searchLogo" /> */}
            {/* </IconButton> */}
          </Paper>
        </div>
      </div>
    </div>
  );
}
