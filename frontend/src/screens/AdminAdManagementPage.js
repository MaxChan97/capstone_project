import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import { logOut } from "../redux/actions/index";
import Banned from "./AdminBannedAccessPage";
import { useEffect } from "react";
export default function AdminAdManagementPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const isAdmin = useSelector((state) => state.isAdmin);
  useEffect(() => {
    console.log(currentUser);
    }, []);
  return isAdmin == true ? (
    <div className="content-wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Advertisement Management</h1>
      </div>
    </div>
  ) : (
    <Banned></Banned>
  );
}
