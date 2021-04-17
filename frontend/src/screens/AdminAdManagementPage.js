import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { logOut } from "../redux/actions/index";
import { withStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import AdvertList from "../components/AdminPage/AdvertList";
import { Link } from "react-router-dom";
import Banned from "./AdminBannedAccessPage";

export default function AdminAdManagementPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const isAdmin = useSelector((state) => state.isAdmin);


  const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText("#3B21CB"),
      backgroundColor: "#3B21CB",
      "&:hover": {
        backgroundColor: "#260eab",
      },
    },
  }))(Button);

  return isAdmin == true ? (
    <div className="content-wrapper">
      <div className = "container">
        <div className="row">
          <div className="col-md-12 mt-4" style={{ textAlign: "left", }}>

            <Link to="/admin/createAd">
              <ColorButton
                style={{
                  height: "35px",
                  width: "250px",
                  outline: "none",
                  float: "right",
                  fontWeight: "600",
                  margin: "20px"
                }}

                variant="contained"
                color="primary"
                type="button"
              >
                <i class='fas fa-plus'></i> &nbsp;
                  Create New Ad
                </ColorButton>
            </Link>

          </div>
        </div>
        <div className="col-md-12 mt-1">
          <AdvertList></AdvertList>
        </div>
      </div>
    </div>
  ) : (
    <Banned></Banned>
  );
}
