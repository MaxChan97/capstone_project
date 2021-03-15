import React, {  useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import { logOut } from "../redux/actions/index";

export default function AdminInboxPage() {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.isAdmin);
  const currentUser = useSelector((state) => state.currentUser);

  /*
  useEffect(() => { 
    console.log(isAdmin);
    console.log(currentUser);
  },[]);
  */
  return (
    <div className="content-wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Inbox</h1>
      </div>
    </div>
  );
}
