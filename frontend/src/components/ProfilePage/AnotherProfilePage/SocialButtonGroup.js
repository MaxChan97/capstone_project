import React from "react";
import { Button } from "@material-ui/core";
import chatLogo from "../../../assets/Chat logo.svg";
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

export default function SocialButtonGroup({ id }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "35%",
        marginRight: "2.31%",
      }}
    >
      <Link style={{ marginRight: "3%" }} to={"/chat/" + id}>
        <Button style={{ height: "40px", width: "25px" }} variant="contained">
          <img src={chatLogo} alt="chatLogo" />
        </Button>
      </Link>
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
        Follow
      </ColorButton>
      <Button
        style={{ height: "40px", width: "160px", outline: "none" }}
        variant="outlined"
        color="primary"
      >
        Subscribe
      </Button>
    </div>
  );
}
