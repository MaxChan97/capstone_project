import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { logOut } from "../redux/actions/index";
import { withStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import AdminList from "../components/AdminPage/AdminList";
import { Link } from "react-router-dom";

export default function AdminManagementPage() {
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
      <div className="container">
        <div className="row">
          <div className="col-md-12 mt-4" style={{ textAlign: "left", }}>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Link to="/admin/createAdmin">
                <ColorButton
                  style={{
                    height: "35px",
                    width: "300px",
                    outline: "none",
                    float: "right",
                    fontWeight: "600",
                    margin: "20px"
                  }}

                  variant="contained"
                  color="primary"
                  type="button"
                >
                  Create Admin Account
                </ColorButton>
              </Link>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Link to="/admin/inbox">
                  <ColorButton
                    style={{
                      height: "35px",
                      width: "300px",
                      outline: "none",
                      float: "right",
                      fontWeight: "600",
                      backgroundColor: "#EA3F79",
                      margin: "20px"
                    }}

                    variant="contained"
                    color="primary"
                    type="button"
                  >
                    View all admin logs
                  </ColorButton>
                </Link>
              </div>
            </div>

          </div>
        </div>
        <div className="col-md-12 mt-4">
          <AdminList></AdminList>
        </div>
      </div>
    </div>
  ): (
    <h1>No Access</h1>
);
}
