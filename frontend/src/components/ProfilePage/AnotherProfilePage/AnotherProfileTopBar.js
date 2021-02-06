import React, { useState } from "react";
import ProfileGroup from "../ProfileGroup";
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
    marginLeft: theme.spacing(1),
    "&:focus": {
      opacity: 1,
      color: "#3B21CB",
      outline: "none",
    },
  },
}))((props) => <Tab disableRipple {...props} />);

export default function AnotherProfileTopBar({
  tabValue,
  setTabValue,
  username,
  numFollowers,
}) {
  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{ backgroundColor: "#EBE8FF", height: "250px", width: "100%" }}
      ></div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: "2.5%",
          backgroundColor: "#FDFDFD",
        }}
      >
        <ProfileGroup username={username} numFollowers={numFollowers} />
        <SocialButtonGroup />
      </div>
      <div style={{ backgroundColor: "#FDFDFD", paddingTop: "1%" }}>
        <StyledTabs value={tabValue} onChange={handleTabValueChange}>
          <StyledTab label="Videos" />
          <StyledTab label="Feed" />
          <StyledTab label="About" />
        </StyledTabs>
      </div>
    </div>
  );
}
