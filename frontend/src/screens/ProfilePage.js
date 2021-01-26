import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import TopBar from "../components/ProfilePage/TopBar";
import ProfilePostCard from "../components/ProfilePostCard";

export default function ProfilePage() {
  const [tabValue, setTabValue] = useState(0);
  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  const handleTabView = (tabValue) => {
    if (tabValue === 3) {
      return (
        <div style={{ marginTop: "20px" }}>
          <ProfilePostCard />
          <ProfilePostCard />
        </div>
      );
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
