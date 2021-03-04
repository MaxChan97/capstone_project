import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import NiceInputPassword from "react-nice-input-password";
import "react-nice-input-password/dist/react-nice-input-password.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function CustomiseProfile() {
  const classes = useStyles();
  const alert = useAlert();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText("#3B21CB"),
      backgroundColor: "#3B21CB",
      "&:hover": {
        backgroundColor: "#260eab",
      },
    },
  }))(Button);

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleOldPasswordVisibleChange = (event) => {
    setIsOldPasswordVisible(!isOldPasswordVisible);
  };

  const handleNewPasswordVisibleChange = (event) => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (oldPassword == "") {
      alert.show("Please enter a password");
    } else if (newPassword == "") {
      alert.show("Please enter a password");
    } else if (oldPassword == newPassword) {
      alert.show("Please use a different password");
    } else {
      Api.changePassword(currentUser, oldPassword, newPassword)
        .done(() => {
          alert.show("Password updated successfully!");
          setOldPassword("");
          setNewPassword("");
        })
        .fail((xhr, status, error) => {
          if (xhr.responseJSON.error === "Missing person password") {
            alert.show("Password is missing");
          }
          if (xhr.responseJSON.error === "Wrong password") {
            alert.show("Old password is wrong");
          }
        });
    }
  };

  return (
    <div className="content-wrapper">
      <div className="container ml-4">
        <div className="row">
          <div className="col-9">
            <div className="card card-primary mt-4">
              <div className="card-body">
                <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                  Change Password
                </Box>
                <div className="card-body">
                  <div className="form-group row">
                    <label for="oldPassword" class="col-3 col-form-label">
                      Old Password
                    </label>
                    <div class="col-sm-7">
                      <input
                        type={isOldPasswordVisible ? "text" : "password"}
                        class="form-control"
                        id="oldPassword"
                        required
                        value={oldPassword}
                        onChange={handleOldPasswordChange}
                      ></input>
                    </div>
                    <div className="col-2">
                      <button
                        className="btn"
                        onClick={handleOldPasswordVisibleChange}
                      >
                        <i className="far fa-eye text-secondary"></i>
                      </button>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label for="newPassword" class="col-3 col-form-label">
                      New Password
                    </label>
                    <div className="col-7">
                      <input
                        type={isNewPasswordVisible ? "text" : "password"}
                        className="form-control"
                        id="newPassword"
                        required
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                      ></input>
                    </div>
                    <div className="col-2">
                      <button
                        className="btn"
                        onClick={handleNewPasswordVisibleChange}
                      >
                        <i className="far fa-eye text-secondary"></i>
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-8"></div>
                    <div className="col-2">
                      <ColorButton
                        style={{
                          height: "35px",
                          width: "100px",
                          outline: "none",
                          fontWeight: "600",
                        }}
                        color="primary"
                        onClick={handleSubmit}
                      >
                        Save
                      </ColorButton>
                    </div>
                    <div className="col-2 ml-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
