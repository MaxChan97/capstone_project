/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import defaultDP from "../assets/Default Dp logo.svg";
import defaultBanner from "../assets/Profile Banner Image.png";
import Select from "react-select";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import { storage } from "../firebase";
import MyCommunitiesCard from "../components/CommunityPage/MyCommunitiesCard";
import TopCommunitiesCard from "../components/CommunityPage/TopCommunitiesCard";
var uuid = require("uuid");

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function CreateCommunity() {
  const leaderboardList = [
    { name: "WallStreetBets", rank: "1" },
    { name: "HUATHUAT", rank: "2" },
    { name: "STONKS", rank: "3" },
    { name: "Bullish", rank: "4" },
    { name: "Cryptocurrency101", rank: "5" },
    { name: "ETFs", rank: "6" },
    { name: "Bitcoin", rank: "7" },
    { name: "Finance1010", rank: "8" },
    { name: "AngPao", rank: "9" },
  ];

  const alert = useAlert();
  const [leaderboard, setLeaderboard] = useState(leaderboardList);

  const currentUser = useSelector((state) => state.currentUser);
  const [
    followingAndOwnedCommunities,
    setFollowingAndOwnedCommunityList,
  ] = useState([]);

  const [currentPerson, setCurrentPerson] = useState({});

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
    Api.getFollowingAndOwnedCommunities(currentUser)
      .done((followingAndOwnedCommunities) => {
        setFollowingAndOwnedCommunityList(followingAndOwnedCommunities);
        console.log(currentPerson);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
  }

  return (
    <div className="content-wrapper">
      <div
        style={{
          paddingLeft: "70px",
          paddingRight: "98px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div className="col-md-9 mt-4">
            <MyCommunitiesCard communityList={followingAndOwnedCommunities} />
          </div>
          <div
            className="col-md-3 mt-4"
            style={{ textAlign: "left", marginLeft: "28px" }}
          >
            <div className="card card-primary">
              <div className="card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ColorButton
                    style={{
                      height: "35px",
                      width: "300px",
                      outline: "none",
                      float: "right",
                      fontWeight: "600",
                    }}
                    href="/createCommunity"
                    variant="contained"
                    color="primary"
                    type="button"
                  >
                    Create Community
                  </ColorButton>
                </div>
              </div>
            </div>
            <div className="card card-primary">
              <TopCommunitiesCard data={leaderboard} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
