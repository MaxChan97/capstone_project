import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../redux/actions/index";

export default function LivePage() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Live Page</h1>
        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch(logOut());
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}