/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import error from "../assets/Error.png";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function ErrorPage() {
  return (
    <div className="content-wrapper">
      <div className="container">
        <div className="row">
          <img
            style={{
              resizeMode: "repeat",
              height: 350,
              marginTop: "90px",
              marginLeft: "430px",
            }}
            src={error}
          />
        </div>
        <div className="row">
          <p
            style={{ marginTop: "30px", marginLeft: "385px", fontSize: "20px" }}
          >
            Oh no! We apologise for the inconvenience but <br/>
            the piggy might have been broken by accident...
          </p>
        </div>
        <div className="row">
          <ColorButton
            style={{
              height: "35px",
              width: "240px",
              outline: "none",
              float: "right",
              fontWeight: "600",
              marginLeft: "460px",
              marginTop: "20px",
              marginBottom:"130px"
            }}
            href="/"
            variant="contained"
            color="primary"
            type="button"
          >
            Take Piggy Home
          </ColorButton>
        </div>
      </div>
    </div>
  );
}
