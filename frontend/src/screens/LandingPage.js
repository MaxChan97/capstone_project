import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../redux/actions/index";

export default function LandingPage() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <h1>Landing Page</h1>
      <button
        onClick={(e) => {
          e.preventDefault();
          dispatch(logOut());
        }}
      >
        Log Out
      </button>
    </div>
  );
}
