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

export default function ProfileManagementButtonGroup() {
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
        Customise
      </ColorButton>
      <Button
        style={{ height: "40px", width: "160px", outline: "none" }}
        variant="outlined"
        color="primary"
      >
        Manage
      </Button>
    </div>
  );
}
