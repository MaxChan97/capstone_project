import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import LeaderboardCard from "../components/FeedPage/LeaderboardCard";
import LiveHorizontalMenu from "../components/FeedPage/LiveHorizontalMenu";
import CreatePostCard from "../components/CommunityPage/CreatePostCard";
import ProfilePostCard from "../components/CommunityPage/ProfilePostCard";
import PostList from "../components/CommunityPage/PostList";
import PostListOfFollowing from "../components/FeedPage/PostListOfFollowing";

export default function FeedPage() {
  const leaderboardList = [
    { name: "item1", rank: "1" },
    { name: "item2", rank: "2" },
    { name: "item3", rank: "3" },
    { name: "item4", rank: "4" },
    { name: "item5", rank: "5" },
    { name: "item6", rank: "6" },
    { name: "item7", rank: "7" },
    { name: "item8", rank: "8" },
    { name: "item9", rank: "9" },
  ];

  const horizontalList = [
    {
      name: "Carl",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/7.png?alt=media&token=947053da-100e-45e8-9d04-4cb3308a6752",
    },
    {
      name: "Max",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/4.jpg?alt=media&token=69f3a6ad-2760-44a1-8cef-71cc5afa83de",
    },
    {
      name: "Shawn",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/6.png?alt=media&token=eb821955-61df-4541-a24b-fc5fdcf73fc1",
    },
    {
      name: "Megan",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/5.jpg?alt=media&token=83ca539e-7ecc-49aa-b963-f01534f015fe",
    },
    {
      name: "Xin Yi",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/3.png?alt=media&token=2f08d223-83f6-4ca4-92be-f520d2fdbe3b",
    },
    {
      name: "Sing Jie",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/2.jpg?alt=media&token=ae0cd3a5-2a21-4175-b486-d312ef9b3f9b",
    },
    {
      name: "LHH",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/1.jpeg?alt=media&token=b7a7f029-7934-42cc-8117-4ed9434c9e63",
    },
    {
      name: "TWK",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/7.png?alt=media&token=947053da-100e-45e8-9d04-4cb3308a6752",
    },
    {
      name: "LHL",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/7.png?alt=media&token=947053da-100e-45e8-9d04-4cb3308a6752",
    },
  ];

  const [leaderboard, setLeaderboard] = useState(leaderboardList);
  const [horizontalMenu, setHorizontalMenu] = useState(horizontalList);

  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {}, [leaderboard]);
  useEffect(() => {}, [horizontalMenu]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <LiveHorizontalMenu data={horizontalMenu}></LiveHorizontalMenu>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 mt-4">
            <PostListOfFollowing></PostListOfFollowing>
          </div>
          
          <div className="col-md-4 mt-4" style={{ textAlign: "left" }}>
            <LeaderboardCard data={leaderboard} />
          </div>
        </div>
      </div>
    </div>
  );
}
