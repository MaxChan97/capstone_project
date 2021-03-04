import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import LeaderboardCard from "../components/FeedPage/LeaderboardCard";
import LiveHorizontalMenu from "../components/FeedPage/LiveHorizontalMenu";
import CreatePostCard from "../components/CommunityPage/CreatePostCard";
import ProfilePostCard from "../components/CommunityPage/ProfilePostCard";
import PostList from "../components/CommunityPage/PostList";
import PostListOfFollowing from "../components/CommunityPage/PostListOfFollowing";

export default function CommunityFeedPage() {

  const currentUser = useSelector((state) => state.currentUser);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div className="container">
       
        <div className="row">
          <div className="col-md-8 mt-4">
            <PostListOfFollowing></PostListOfFollowing>
          </div>
          
          <div className="col-md-4 mt-4" style={{ textAlign: "left" }}>
            
          </div>
        </div>
      </div>
    </div>
  );
}
