import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import { logOut } from "../redux/actions/index";
import Banned from "./AdminBannedAccessPage";

export default function AdminAnalyticsPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const isAdmin = useSelector((state) => state.isAdmin);

  return isAdmin == true ? (
    <div className="content-wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Site Analytics</h1>
      </div>
    </div>
  ): (
    <Banned></Banned>
  );
}
