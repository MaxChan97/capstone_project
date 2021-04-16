import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import failbear from "../assets/failbear.png";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function BannedPage() {
  return (
    <div className="content-wrapper">
      <div className="container">
        <div className="row">
          <img
            style={{
              resizeMode: "repeat",
              height: 350,
              marginTop: "90px",
              marginLeft: "250px",
            }}
            src={failbear}
          />
        </div>
        <div className="row">
          <p
            style={{ marginTop: "30px", marginLeft: "480px", fontSize: "20px" }}
          >
            Payment Not Successful!!
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
              marginLeft: "440px",
              marginTop: "20px",
              marginBottom:"160px"
            }}
            href="/feed"
            variant="contained"
            color="primary" 
            type="button"
          >
            Back To Home
          </ColorButton>
        </div>
      </div>
    </div>
  );
}
