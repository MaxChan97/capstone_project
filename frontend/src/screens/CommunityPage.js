import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import TopBar from "../components/CommunityPage/TopBar";
import CreatePostCard from "../components/CommunityPage/CreatePostCard";
import ProfilePostCard from "../components/CommunityPage/ProfilePostCard";
import AboutMe from "../components/CommunityPage/AboutMe";
import PostList from "../components/CommunityPage/PostList";
import SearchCard from "../components/CommunityPage/SearchCard";

export default function CommunityPage() {
  const [tabValue, setTabValue] = useState(0);
  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  const handleTabView = (tabValue) => {
    if (tabValue === 0) {
      return (
        <div className="container mt-3 ">
          <div className="row">
            <div className="col-md-8">
              <CreatePostCard />
              <ProfilePostCard />
              <PostList />
            </div>
            <div className="col-md-4" style={{ textAlign: "left" }}>
              <SearchCard />
            </div>
          </div>
        </div>
      );
    }
    if (tabValue === 1) {
      return <AboutMe />;
    }
    return "";
  };

  return (
    <div className="content-wrapper">
      <TopBar tabValue={tabValue} setTabValue={setTabValue} />
      {handleTabView(tabValue)}
    </div>
  );
}
