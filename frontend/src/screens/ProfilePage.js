import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import TopBar from "../components/ProfilePage/TopBar";

export default function ProfilePage() {
  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }
  return (
    <div className="content-wrapper">
      <TopBar />
    </div>
  );
}
