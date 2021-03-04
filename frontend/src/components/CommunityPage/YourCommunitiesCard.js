/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import defaultDP from "../../assets/Default Dp logo.svg";
import defaultBanner from "../../assets/Profile Banner Image.png";
import Select from "react-select";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";
import { storage } from "../../firebase";
import MyCommunitiesCardForFeed from "../../components/CommunityPage/MyCommunitiesCardForFeed";

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

export default function YourCommunitiesCard() {
 

  const alert = useAlert();

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
      <div className="container">
        <div className="row">
          <div className=" mt-4">
            <MyCommunitiesCardForFeed communityList={followingAndOwnedCommunities} />
          </div>
          
        </div>
      </div>
    </div>
  );
}
