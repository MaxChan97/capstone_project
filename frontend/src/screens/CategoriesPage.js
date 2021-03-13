import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { logOut } from "../redux/actions/index";
import { useDispatch } from "react-redux";

export default function CategoriesPage() {
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
        <h1>Categories Page</h1>
      </div>
    </div>
  );
}
