import React, { useState } from "react";
import ProfileGroup from "./ProfileGroup";
import SocialButtonGroup from "./SocialButtonGroup";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Tab } from "@material-ui/core";

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
    marginRight: theme.spacing(1),
    "&:focus": {
      opacity: 1,
      color: "#3B21CB",
      outline: "none",
    },
  },
}))((props) => <Tab disableRipple {...props} />);

export default function TopBar({ tabValue, setTabValue }) {
  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          style={{ backgroundColor: "#EBE8FF", height: "250px", width: "100%" }}
        ></div>
      </div>
      <div className="row py-4" style={{ backgroundColor: "#FDFDFD" }}>
        <div className="col-sm-8">
          <ProfileGroup />
        </div>
        <div className="col-sm-4 d-flex justify-content-center">
          <SocialButtonGroup />
        </div>
      </div>
      <div className="row" style={{ backgroundColor: "#FDFDFD" }}>
        <StyledTabs value={tabValue} onChange={handleTabValueChange}>
          <StyledTab label="Posts" />
          <StyledTab label="About" />
        </StyledTabs>
      </div>
    </div>
  );
}
