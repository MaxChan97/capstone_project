import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { logOut } from "../redux/actions/index";
import { withStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";

export default function AdminManagementPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);



  const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText("#3B21CB"),
      backgroundColor: "#3B21CB",
      "&:hover": {
        backgroundColor: "#260eab",
      },
    },
  }))(Button);

  return (
    <div className="content-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-md-8 mt-4">

          </div>
          <div className="col-md-4 mt-4" style={{ textAlign: "left" }}>
            <div className="card card-primary">
              <div className="card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ColorButton
                    style={{
                      height: "35px",
                      width: "300px",
                      outline: "none",
                      float: "right",
                      fontWeight: "600",
                    }}
                    href="/admin/createAdmin"
                    variant="contained"
                    color="primary"
                    type="button"
                  >
                    Create Admin Account
                </ColorButton>
                </div>
              </div>
            </div>
            <br></br>
            <div className="card card-primary">
              <div className="card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ColorButton
                    style={{
                      height: "35px",
                      width: "300px",
                      outline: "none",
                      float: "right",
                      fontWeight: "600",
                      backgroundColor: "#EA3F79",
                    }}

                    variant="contained"
                    color="primary"
                    type="button"
                  >
                    View all admin logs
                  </ColorButton>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
