import React, { useState, useEffect } from "react";
import searchLogo from "../assets/Search logo.svg";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, IconButton, Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import liveLogo from "../assets/Live Logo.svg";
import uploadLogo from "../assets/Upload logo.svg";
import chatLogo from "../assets/Chat logo.svg";
import notificationLogo from "../assets/Notification Logo.svg";
import defaultDP from "../assets/Default Dp logo.svg";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import Api from "../helpers/Api";
import logout from "../assets/logout 1.svg";
import { logOut, setIsAdmin } from "../redux/actions/index";
import BNBLogo from "../assets/BNB Logo.png";

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

function AdminNavBar({
  searchString,
  setSearchString,
  searchRefresh,
  setSearchRefresh,
}) {
  let location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentPerson, setCurrentPerson] = useState({});
  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser);
    }
  }, [currentUser]);

  if (currentUser === null) {
    return <Redirect to="/admin/login" />;
  }

  function handleSearch(event) {
    if (searchString != null && searchString != "") {
      if (location.pathname === "/search") {
        setSearchRefresh(!searchRefresh);
      }
      history.push("/search");
    }
  }

  function handleEnterKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  }

  function loadData(currentUser) {
    Api.getPersonById(currentUser)
      .done((currentPerson) => {
        setCurrentPerson(currentPerson);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
  }

  function handleLogOut(e) {
    e.preventDefault();
    dispatch(logOut());
    dispatch(setIsAdmin(null));
    history.push("/admin/login");
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
            {location.pathname.slice(0, 5) !== "/chat" ? (
              <a
                className="nav-link"
                data-widget="pushmenu"
                style={{ cursor: "pointer" }}
              >
                <i style={{ fontSize: "18px" }} className="fa fa-bars" />
              </a>
            ) : (
              <a className="nav-link">
                <i
                  style={{ fontSize: "18px", visibility: "hidden" }}
                  className="fa fa-bars"
                />
              </a>
            )}
          </li>
        </ul>
      </div>

      <div>
        <Link to="/admin/inbox">
          <img
            style={{ height: "40px", display: "flex" }}
            src={BNBLogo}
            alt="BNB Logo"
          />
        </Link>
      </div>

      <div>
        <Paper component="form" className={classes.root}>
          <IconButton
            style={{ outline: "none" }}
            className={classes.iconButton}
            aria-label="search"
            onClick={handleSearch}
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
            onKeyPress={handleEnterKeyPress}
          />
        </Paper>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          width: "10%",
        }}
      >
          {/*
        <Link to="/">
          <img src={liveLogo} alt="liveLogo" />
        </Link>
        <Link to="/">
          <img src={uploadLogo} alt="uploadLogo" />
        </Link>
        <Link to={"/chat/" + currentUser}>
          <img src={chatLogo} alt="chatLogo" />
        </Link>
          */}
        <Link to="/">
          <img src={notificationLogo} alt="notificationLogo" />
        </Link>
        <Link onClick={handleLogOut}>
          <img src={logout} alt="log out" />
        </Link>
        {/*
        <Link to={"/profile/" + currentUser}>
          <img
            className="rounded-circle"
            style={{ height: "3vh" }}
            src={currentPerson.profilePicture || defaultDP}
          />
        </Link>
        */}
      </div>
    </nav>
  );
}
export default AdminNavBar;
