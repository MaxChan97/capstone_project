import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Tab } from "@material-ui/core";
import SubscribingGroup from "./SubscribingGroup";


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

export default function SubscribingPageTopBar({
  tabValue,
  setTabValue,
  username,
  numSubscribing
}) {
  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: "2.5%",
          backgroundColor: "#FDFDFD",
        }}
      >
        <SubscribingGroup username={username} numSubscribing={numSubscribing} />
      </div>
      <div style={{ backgroundColor: "#FDFDFD", paddingTop: "1%" }}>
        <StyledTabs value={tabValue} onChange={handleTabValueChange}>
          <StyledTab label="Live" />
          <StyledTab label="Videos" />
          <StyledTab label="Channel" />
        </StyledTabs>
      </div>
    </div>
  );
}
