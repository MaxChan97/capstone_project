import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import OwnProfileTopBar from "../components/ProfilePage/OwnProfilePage/OwnProfileTopBar";
import CreatePostCard from "../components/ProfilePage/OwnProfilePage/CreatePostCard";
import ProfilePostCard from "../components/ProfilePage/ProfilePostCard";
import AboutMe from "../components/ProfilePage/AboutMe";
import PostList from "../components/ProfilePage/PostList";

export default function OwnProfilePage() {
  const [tabValue, setTabValue] = useState(0);
  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  const handleTabView = (tabValue) => {
    if (tabValue === 1) {
      return (
        <div style={{ marginTop: "20px" }}>
          <CreatePostCard />
          <PostList />
        </div>
      );
    }
    if (tabValue === 2) {
      return (
        <div style={{ marginTop: "20px" }}>
          <AboutMe />
        </div>
      );
    }
    return "";
  };

  return (
    <div className="content-wrapper">
      <OwnProfileTopBar
        tabValue={tabValue}
        setTabValue={setTabValue}
        username={currentUser.username}
        numFollowers={currentUser.followers.length}
      />
      {handleTabView(tabValue)}
    </div>
  );
}
