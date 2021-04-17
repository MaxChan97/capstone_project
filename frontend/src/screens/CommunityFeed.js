import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import PostListOfFollowing from "../components/CommunityPage/PostListOfFollowing";
import YourCommunitiesCard from "../components/CommunityPage/YourCommunitiesCard";
import TopCommunitiesCard from "../components/CommunityPage/TopCommunitiesCard";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Api from "../helpers/Api";

export default function CommunityFeedPage() {
  const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText("#3B21CB"),
      backgroundColor: "#3B21CB",
      "&:hover": {
        backgroundColor: "#260eab",
      },
    },
  }))(Button);

  const currentUser = useSelector((state) => state.currentUser);
  const [topCommunities, setTopCommunities] = useState([]);

  useEffect(() => {
    Api.getTopCommunities()
      .done((topCommunities) => {
        setTopCommunities(topCommunities);
        console.log(topCommunities);
      })
      .fail((xhr, status, error) => {
        alert("Error!");
      });
  }, []);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-9 mt-4">
            <PostListOfFollowing />
          </div>

          <div className="col-3 mt-4">
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
                        height: "50px",
                        width: "200px",
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
            <YourCommunitiesCard />
            <TopCommunitiesCard data={topCommunities} />
          </div>
        </div>
      </div>
    </div>
  );
}
