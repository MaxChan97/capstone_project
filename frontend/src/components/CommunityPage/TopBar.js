/* eslint-disable jsx-a11y/img-redundant-alt */
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
    marginRight: theme.spacing(-5),
    "&:focus": {
      opacity: 1,
      color: "#3B21CB",
      outline: "none",
    },
  },
}))((props) => <Tab disableRipple {...props} />);

export default function TopBar({ 
  tabValue, 
  setTabValue, 
  communityName,
  numMembers,
  communityPicture,
  communityBanner,
}) {
  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
    
      <img
        style={{
          width:"100%"
        }}
        src={communityBanner}
        alt="Community Banner"
      />
     
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
        communityName={communityName}
        numMembers={numMembers}
        communityPicture={communityPicture}
        />
        <SocialButtonGroup />
      </div>
      <div style={{ backgroundColor: "#FDFDFD", paddingTop: "1%", paddingLeft:"5%"}}>
        <StyledTabs value={tabValue} onChange={handleTabValueChange}>
          <StyledTab label="Posts" />
          <StyledTab label="About" />
        </StyledTabs>
      </div>
    </div>
  );
}
