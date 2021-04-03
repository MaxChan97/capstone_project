import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import LeaderboardCard from "../components/FeedPage/LeaderboardCard";
import LiveHorizontalMenu from "../components/FeedPage/LiveHorizontalMenu";
import CreatePostCard from "../components/CommunityPage/CreatePostCard";
import ProfilePostCard from "../components/CommunityPage/ProfilePostCard";
import PostList from "../components/CommunityPage/PostList";
import PostListOfFollowing from "../components/CommunityPage/PostListOfFollowing";
import YourCommunitiesCard from "../components/CommunityPage/YourCommunitiesCard";
import MyCommunitiesCard from "../components/CommunityPage/MyCommunitiesCard";
import TopCommunitiesCard from "../components/CommunityPage/TopCommunitiesCard";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

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

  const [leaderboard, setLeaderboard] = useState(leaderboardList);

  const currentUser = useSelector((state) => state.currentUser);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div style={{paddingLeft:"10px", paddingRight:"10px"}} >

        <div className="row">
          <div className="col-md-9 mt-4">
            <PostListOfFollowing></PostListOfFollowing>
          </div>

          <div className="col-md-3 mt-4" style={{ textAlign: "left", paddingTop: "10px" }}>

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
                        width: "250px",
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
            <YourCommunitiesCard></YourCommunitiesCard>
            <div className="card card-primary">
              <TopCommunitiesCard data={leaderboard} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
