import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import { logOut } from "../redux/actions/index";
import Banned from "./AdminBannedAccessPage";
import UsersList from "../components/AdminPage/UsersList";

export default function AdminUserManagementPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const isAdmin = useSelector((state) => state.isAdmin);

  return isAdmin == true ? (
    <div className="content-wrapper">
      <div >
        <div className="col-md-12 mt-4">
          <UsersList></UsersList>
        </div>
      </div>
    </div>
  ) : (
    <Banned></Banned>
  );
}
