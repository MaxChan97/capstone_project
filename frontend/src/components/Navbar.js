import React, { useState } from "react";
import searchLogo from "../assets/Search logo.svg";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, IconButton, Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import liveLogo from "../assets/Live Logo.svg";
import uploadLogo from "../assets/Upload logo.svg";
import chatLogo from "../assets/Chat logo.svg";
import notificationLogo from "../assets/Notification Logo.svg";
import defaultDP from "../assets/Default Dp logo.svg";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 500,
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

function Navbar() {
  const classes = useStyles();
  const [searchString, setSearchString] = useState("");
  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <nav
      style={{
        flex: "1",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
      className="main-header navbar navbar-expand bg-white navbar-light border-bottom"
    >
      <div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              style={{ cursor: "pointer" }}
            >
              <i style={{ fontSize: "18px" }} className="fa fa-bars" />
            </a>
          </li>
        </ul>
      </div>
      <div>
        <Paper component="form" className={classes.root}>
          <IconButton
            style={{ outline: "none" }}
            className={classes.iconButton}
            aria-label="search"
          >
            <img src={searchLogo} alt="searchLogo" />
          </IconButton>
          <InputBase
            value={searchString}
            className={classes.input}
            placeholder="Search"
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
          />
        </Paper>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          width: "21%",
        }}
      >
        <Link to="/">
          <img src={liveLogo} alt="liveLogo" />
        </Link>
        <Link to="/">
          <img src={uploadLogo} alt="uploadLogo" />
        </Link>
        <Link to="/">
          <img src={chatLogo} alt="chatLogo" />
        </Link>
        <Link to="/">
          <img src={notificationLogo} alt="notificationLogo" />
        </Link>
        <Link to={"/profile/" + currentUser.id}>
          <img src={defaultDP} alt="defaultDP" />
        </Link>
      </div>
    </nav>
  );
}
export default Navbar;
