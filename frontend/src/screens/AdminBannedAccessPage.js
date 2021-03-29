/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import banned from "../assets/Banned.png";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function AdminBannedAccessPage() {
  return (
    <div className="content-wrapper">
      <div className="container">
        <div className="row">
          <img
            style={{
              resizeMode: "repeat",
              height: 350,
              marginTop: "90px",
              marginLeft: "400px",
            }}
            src={banned}
          />
        </div>
        <div className="row">
          <p
            style={{ marginTop: "30px", margin:"auto", fontSize: "30px" }}
          >
            You have no administrative access to this page!
          </p>
        </div>

      </div>
    </div>
  );
}
