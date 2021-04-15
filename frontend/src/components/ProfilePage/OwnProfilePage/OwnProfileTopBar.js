/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import ProfileGroup from "../ProfileGroup";
import ProfileManagementButtonGroup from "./ProfileManagementButtonGroup";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Tab } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { storage } from "../../../firebase";
import CircularProgressWithLabel from "../../../components/CircularProgressWithLabel.js";
import Api from "../../../helpers/Api";
import { useAlert } from "react-alert";
import { useSelector, useDispatch } from "react-redux";

var uuid = require("uuid");

const ColorButton = withStyles((theme) => ({
  root: {
    color: "#000000",
    backgroundColor: "#EAECEF",
    "&:hover": {
      backgroundColor: "#B1B4BA",
    },
  },
}))(Button);

const ColorButton2 = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#EA3F79"),
    backgroundColor: "#EA3F79",
    "&:hover": {
      backgroundColor: "#FF9EBF",
    },
  },
}))(Button);

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#4A5056",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginLeft: theme.spacing(1),
    "&:focus": {
      opacity: 1,
      color: "#3B21CB",
      outline: "none",
    },
  },
}))((props) => <Tab disableRipple {...props} />);

export default function OwnProfileTopBar({
  tabValue,
  setTabValue,
  username,
  numFollowers,
  profilePicture,
  profileBanner,
  badge,
  setProfileBanner,
  refresh,
  setRefresh,
  personId,
  setProfilePicture,
  user,
}) {
  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const alert = useAlert();
  const isAdmin = useSelector((state) => state.isAdmin);
  const [editedBanner, setEditedBanner] = useState(false);

  const [bannerProgress, setBannerProgress] = useState(0);

  const changeProfileBannerHandler = (event) => {
    var oldName = event.target.files[0].name;
    var suffix = oldName.split(".")[1];
    var randomId = uuid.v4();
    var newName = randomId.toString() + "." + suffix;
    const uploadTask = storage
      .ref(`images/${newName}`)
      .put(event.target.files[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setBannerProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(newName)
          .getDownloadURL()
          .then((profileBanner) => {
            setProfileBanner(profileBanner);
            setEditedBanner(true);
            console.log(profileBanner);
          });
      }
    );
  };

  const handleBannerChange = () => {
    Api.editPersonProfileBanner(personId, profileBanner)
      .done(() => {
        alert.show("Banner updated successfully!");
        setRefresh(!refresh);
        setEditedBanner(false);
      })
      .fail((xhr, status, error) => {
        //alert.show("Something went wrong, please try again!");
        alert.show(xhr.responseJSON.error);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {profileBanner ? (
        <div className="button-container">
          {bannerProgress > 0 && bannerProgress < 100 ? (
            <div className="d-flex justify-content-center">
              <CircularProgressWithLabel value={bannerProgress} size={80} />
            </div>
          ) : (
            <div className="button-container">
              <img
                className="img-fluid"
                style={{ width: "100%", maxHeight: "250px" }}
                src={profileBanner}
              />
              {editedBanner === true ? (
                <div>
                  <ColorButton
                    style={{
                      height: "35px",
                      width: "160px",
                      outline: "none",
                      float: "right",
                      fontWeight: "600",
                      marginTop: "-60px",
                      marginRight: "200px",
                    }}
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    CANCEL
                  </ColorButton>
                  <ColorButton2
                    style={{
                      height: "35px",
                      width: "160px",
                      outline: "none",
                      float: "right",
                      fontWeight: "600",
                      marginTop: "-60px",
                      marginRight: "30px",
                    }}
                    variant="contained"
                    color="primary"
                    onClick={handleBannerChange}
                  >
                    SAVE CHANGES
                  </ColorButton2>
                </div>
              ) : null}
            </div>
          )}
          {isAdmin === false && editedBanner === false ? (
            <ColorButton
              style={{
                height: "35px",
                width: "160px",
                outline: "none",
                float: "right",
                fontWeight: "600",
                marginTop: "-60px",
                marginRight: "30px",
              }}
              variant="contained"
              color="primary"
            >
              <label>
                <p style={{ marginTop: "25px" }}>EDIT BANNER</p>
                <input
                  id="pb"
                  type="file"
                  name="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={changeProfileBannerHandler}
                />
              </label>
            </ColorButton>
          ) : null}
        </div>
      ) : (
        <div
          style={{ backgroundColor: "#EBE8FF", height: "250px", width: "100%" }}
        ></div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: "2.5%",
          backgroundColor: "#FDFDFD",
        }}
      >
        <ProfileGroup
          username={username}
          numFollowers={numFollowers}
          profilePicture={profilePicture}
          badge={badge}
          personId={personId}
          setProfilePicture={setProfilePicture}
          refresh={refresh}
          setRefresh={setRefresh}
        />
        <ProfileManagementButtonGroup
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </div>
      <div style={{ backgroundColor: "#FDFDFD", paddingTop: "1%" }}>
        <StyledTabs value={tabValue} onChange={handleTabValueChange}>
          <StyledTab label="Feed" />
          <StyledTab label="Streams" />
          <StyledTab label="About" />
        </StyledTabs>
      </div>
    </div>
  );
}
