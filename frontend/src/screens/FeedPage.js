import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import LeaderboardCard from "../components/FeedPage/LeaderboardCard";
import LiveHorizontalMenu from "../components/FeedPage/LiveHorizontalMenu";
import CreatePostCard from "../components/CommunityPage/CreatePostCard";
import ProfilePostCard from "../components/CommunityPage/ProfilePostCard";
import PostList from "../components/CommunityPage/PostList";

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
    { name: "item1", viewers: "20000", category: "Stocks" },
    { name: "item2", viewers: "20000", category: "Stocks" },
    { name: "item3", viewers: "20000", category: "Stocks" },
    { name: "item4", viewers: "20000", category: "Stocks" },
    { name: "item5", viewers: "20000", category: "Stocks" },
    { name: "item6", viewers: "20000", category: "Stocks" },
    { name: "item7", viewers: "20000", category: "Stocks" },
    { name: "item8", viewers: "20000", category: "Stocks" },
    { name: "item9", viewers: "20000", category: "Stocks" },
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
            <CreatePostCard />
            <ProfilePostCard />
            <PostList />
          </div>
          <div className="col-md-4 mt-4" style={{ textAlign: "left" }}>
            <LeaderboardCard data={leaderboard} />
          </div>
        </div>
      </div>
    </div>
  );
}
