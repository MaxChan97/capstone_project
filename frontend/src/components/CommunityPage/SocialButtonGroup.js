import React from "react";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

const SecondaryButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3C4C4C4"),
    backgroundColor: "#C4C4C4",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function SocialButtonGroup() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "35%",
      }}
    >
      <ColorButton
        style={{
          height: "40px",
          width: "160px",
          outline: "none",
          marginRight: "3%",
        }}
        variant="contained"
        color="primary"
      >
        Join
      </ColorButton>
      <SecondaryButton
        style={{
          height: "40px",
          width: "160px",
          outline: "none",
        }}
        variant="contained"
        color="primary"
      >
        Joined
      </SecondaryButton>
    </div>
  );
}
