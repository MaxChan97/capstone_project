import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

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
  const isAdmin = useSelector((state) => state.isAdmin);
  return isAdmin == false ? (
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
        <Link
          style={{ color: "inherit", textDecoration: "none" }}
          to="/customiseProfile"
        >
          Customise
        </Link>
      </ColorButton>

      <Button
        style={{ height: "40px", width: "160px", outline: "none" }}
        variant="outlined"
        color="primary"
      >
        <Link
          style={{ color: "inherit", textDecoration: "none" }}
          to="/userSettings"
        >
          Manage
        </Link>
      </Button>
    </div>
  ) : (
    ""
  );
}
