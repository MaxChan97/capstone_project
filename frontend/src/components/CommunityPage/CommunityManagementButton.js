import React from "react";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function ProfileManagementButtonGroup({communityId}) {
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
    <Link to={"/community/" + communityId + "/manageDetails"} >
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
        Manage
      </ColorButton>
      </Link>
    </div>
  );
}
