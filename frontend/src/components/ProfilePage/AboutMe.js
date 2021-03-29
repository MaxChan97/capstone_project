/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Api from "../../helpers/Api";

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

  const currentUser = useSelector((state) => state.currentUser);

  console.log(person);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function changeBadge(personId, badgeId) {
    if (person.id === currentUser) {
      Api.changeBadge(personId, badgeId).done(() => {
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

  return (
    <div className="container mt-3 ml-5">
      <div className="row" style={{ textAlign: "left" }}>
        <div className="col-md-8">
          <div className="card card-primary mx-2 p-2">
            <div className="card-body">
              <strong>About</strong>

              <p>{person.description}</p>

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
                  {person.badges.map((badge, index) => (
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
                      <img
                        style={{
                          height: "45px",
                          marginTop: "5px",
                          marginRight: "15px",
                        }}
                        src={badge.image}
                        onClick={() => changeBadge(currentUser, badge.id)}
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div class="col-md-3 ml-3" style={{ textAlign: "left" }}>
          <div class="card card-primary">
            <div class="card-body">
              <div style={{ color: "#3B21CB" }}>
                <strong>
                  LEVEL{" "}
                  {getLevel(
                    totalPoints(
                      person.contentCreatorPoints,
                      person.contributorPoints
                    )
                  )}
                </strong>
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
