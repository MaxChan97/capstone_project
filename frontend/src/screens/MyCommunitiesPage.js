/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import MyCommunitiesCard from "../components/CommunityPage/MyCommunitiesCard";
import TopCommunitiesCard from "../components/CommunityPage/TopCommunitiesCard";
import { Link } from "react-router-dom";

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
  const alert = useAlert();
  const currentUser = useSelector((state) => state.currentUser);

  const [currentPerson, setCurrentPerson] = useState({});
  const [
    followingAndOwnedCommunities,
    setFollowingAndOwnedCommunityList,
  ] = useState([]);
  const [topCommunities, setTopCommunities] = useState([]);

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser);
      console.log(currentUser);
    }
    Api.getTopCommunities()
      .done((topCommunities) => {
        setTopCommunities(topCommunities);
        console.log(topCommunities);
      })
      .fail((xhr, status, error) => {
        alert("Error!");
      });
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
          <div className="col-md-8 mt-4">
            <MyCommunitiesCard communityList={followingAndOwnedCommunities} />
          </div>
          <div className="col-md-4 mt-4" style={{ textAlign: "left" }}>
            <div className="card card-primary">
              <div className="card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Link to="/createCommunity">
                    <ColorButton
                      style={{
                        height: "35px",
                        width: "300px",
                        outline: "none",
                        float: "right",
                        fontWeight: "600",
                      }}
                      variant="contained"
                      color="primary"
                      type="button"
                    >
                      Create Community
                    </ColorButton>
                  </Link>
                </div>
              </div>
            </div>
            <TopCommunitiesCard data={topCommunities} />
          </div>
        </div>
      </div>
    </div>
  );
}
