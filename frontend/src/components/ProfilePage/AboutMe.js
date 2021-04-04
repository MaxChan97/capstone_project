/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Api from "../../helpers/Api";
import tick from "../../assets/tick.png";
import Button from "react-bootstrap/Button";
import EditDescription from "./EditDescription";
import {Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // justifyContent: "center",
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
  badge: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
  },
}));

//chip is the topic tag

export default function AboutMe({ person, refresh, setRefresh }) {
  const classes = useStyles();

  //   const [profilePicture, setProfilePicture] = useState("");
  //   const [profileBanner, setProfileBanner] = useState("");
  const [edit, setEdit] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const currentUser = useSelector((state) => state.currentUser);

  console.log(person);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  const handleEdit = () => {
    setEdit(true);
    setAnchorEl(null);
  };

  function changeBadge(personId, badgeId) {
    if (person.id === currentUser) {
      Api.changeBadge(personId, badgeId).done(() => {
        setRefresh(!refresh);
      });
    }
  }

  function removeBadge(personId) {
    if (person.id === currentUser) {
      Api.changeBadge(personId, 0).done(() => {
        setRefresh(!refresh);
      });
    }
  }

  function toTitleCase(str) {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] =
        frags[i].charAt(0).toUpperCase() + frags[i].substr(1).toLowerCase();
    }
    return frags.join(" ");
  }

  function totalPoints(contentCreatorPoints, contributorPoints) {
    var total = 0;
    total = contentCreatorPoints + contributorPoints;
    return total;
  }

  function getLevel(totalPoints) {
    if (totalPoints >= 10 && totalPoints < 30) {
      return 2;
    } else if (totalPoints >= 30 && totalPoints < 80) {
      return 3;
    } else if (totalPoints >= 80 && totalPoints < 150) {
      return 4;
    } else if (totalPoints >= 150 && totalPoints < 300) {
      return 5;
    } else if (totalPoints >= 300 && totalPoints < 800) {
      return 6;
    } else if (totalPoints >= 800 && totalPoints < 1700) {
      return 7;
    } else if (totalPoints >= 1700 && totalPoints < 3500) {
      return 8;
    } else if (totalPoints >= 3500 && totalPoints < 7000) {
      return 9;
    } else if (totalPoints >= 7000) {
      return 10;
    } else return 1;
  }

  function renderBadges() {
    if (person.id === currentUser) {
      return person.badges.map((badge, index) => (
        <button
          style={{
            height: "45px",
            width: "15px",
            backgroundColor: "transparent",
            borderColor: "transparent",
            marginRight: "60px",
            marginLeft: "-12px",
            outline: "none",
          }}
        >
          {person.badgeDisplaying !== undefined &&
          person.badgeDisplaying.id === badge.id ? (
            <div>
              <img
                style={{
                  height: "45px",
                  marginTop: "15px",
                  marginRight: "15px",
                }}
                src={badge.image}
                onClick={() => removeBadge(currentUser)}
              />
              <img
                style={{
                  marginTop: "-125px",
                  marginLeft: "40px",
                }}
                src={tick}
              />
            </div>
          ) : (
            <img
              style={{
                height: "45px",
                marginTop: "15px",
                marginRight: "15px",
              }}
              src={badge.image}
              onClick={() => changeBadge(currentUser, badge.id)}
            />
          )}
        </button>
      ));
    } else {
      return person.badges.map((badge, index) => (
        <img
          style={{
            height: "45px",
            marginTop: "15px",
            marginRight: "15px",
          }}
          src={badge.image}
        />
      ));
    }
  }

  return (
    <div className="container mt-3 ml-5">
      <div className="row" style={{ textAlign: "left" }}>
        <div className="col-md-8">
          <div className="card card-primary mx-2 p-2">
            <div className="card-body">
              <strong>About</strong>
              <Button
                style={{
                  height: "35px",
                  width: "35px",
                  outline: "none",
                  marginBottom: "3px",
                  marginLeft: "-3px",
                }}
                variant="contained"
                color="primary"
                onClick={handleEdit}
              >
                <i
                  class="fas fa-pen"
                  style={{ height: "25px", width: "25px" }}
                ></i>
              </Button>

              {edit === false ? (
                <p>{person.description}</p>
              ) : (
                <EditDescription
                  autofocus
                  data={person}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  setEdit={setEdit}
                ></EditDescription>
              )}

              <strong> Interests</strong>
              {person.topicInterests !== undefined ? (
                <div component="ul" className={classes.chip}>
                  {person.topicInterests.map((topics, index) => (
                    <Chip
                      label={toTitleCase(topics)}
                      key={index}
                      style={{ backgroundColor: "#F1F3F8" }}
                    />
                  ))}
                </div>
              ) : null}
              <br />
              <strong>My Badges</strong>
              {person.badges !== undefined ? (
                <div component="ul" className={classes.badge}>
                  {renderBadges()}
                </div>
              ) : null}
              <br/>
            </div>
          </div>
        </div>
        <div class="col-md-3 ml-3" style={{ textAlign: "left" }}>
          <div class="card card-primary">
            <div class="card-body">
              <div style={{ color: "#3B21CB" }}>
              <Link to ="/MyCommunities" style={{ color: '#3B21CB' }}>
                <strong>
                  LEVEL{" "}
                  {getLevel(
                    totalPoints(
                      person.contentCreatorPoints,
                      person.contributorPoints
                    )
                  )}
                </strong>
                </Link>
              </div>

              <p>
                {totalPoints(
                  person.contentCreatorPoints,
                  person.contributorPoints
                )}{" "}
                Points
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
