/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import defaultDP from "../assets/Default Dp logo.svg";
import defaultBanner from "../assets/Profile Banner Image.png";
import Select from "react-select";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import { storage } from "../firebase";
import MyCommunitiesCard from "../components/CommunityPage/MyCommunitiesCard";
import TopCommunitiesCard from "../components/CommunityPage/TopCommunitiesCard";
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
              marginLeft: "400px",
            }}
            src={banned}
          />
        </div>
        <div className="row">
          <p
            style={{ marginTop: "30px", marginLeft: "385px", fontSize: "20px" }}
          >
            Oops...You are banned from this community.
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
            href="/community"
            variant="contained"
            color="primary"
            type="button"
          >
            Explore Communities
          </ColorButton>
        </div>
      </div>
    </div>
  );
}
