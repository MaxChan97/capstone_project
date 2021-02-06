import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import SearchCard from "./SearchCard";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

//chip is the topic tag

export default function AboutMe() {
  const classes = useStyles();
  const [topicData, setTopicData] = React.useState([
    { key: 0, label: "Science" },
    { key: 1, label: "Comp Sci" },
    { key: 2, label: "React" },
  ]);

  const [educationLevelData, setEducationLevelData] = React.useState([
    { key: 1, label: "Primary" },
    { key: 2, label: "Secondary" },
    { key: 3, label: "Tertiary" },
    { key: 4, label: "University" },
  ]);

  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container mt-3 ">
      <div className="row" style={{ textAlign: "left" }}>
        <div className="card card-primary mx-2 p-2">
          <div className="card-body">
            <p className="font-weight-bold">About this Community</p>
            <p className="font-weight-light">Created 3 January 2021</p>
            <p className="font-weight-normal">
              Lorem ipsum dolor sit amet, id malorum accusata temporibus est,
              impedit delectus quo in, possit nostro explicari ut eos. Mei eu
              omnium vulputate, quodsi vituperatoribus sit te, sit ad iudico
              diceret. Ad recteque scriptorem has. Mea oratio tincidunt ex, ei
              mea illum exerci, ea sit omittam adipiscing deterruisset. Ut sea
              esse facilisis, periculis inciderint eu vel. Ius habeo tractatos
              constituto no.
            </p>
            <p className="font-weight-bold">Topics</p>
            <div component="ul" className={classes.root}>
              {topicData.map((data) => {
                return (
                  <li key={data.key}>
                    <Chip label={data.label} className={classes.chip} />
                  </li>
                );
              })}
            </div>
            <p className="font-weight-bold">Education Level</p>
            <div component="ul" className={classes.root}>
              {educationLevelData.map((data) => {
                return (
                  <li key={data.key}>
                    <Chip label={data.label} className={classes.chip} />
                  </li>
                );
              })}
            </div>
            <p className="font-weight-bold">Community Owner</p>
            <p className="font-weight-normal">
              @Reaxpert <i class="fas fa-check-circle"></i>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
