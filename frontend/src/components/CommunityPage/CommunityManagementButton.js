import React from "react";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminDeleteComm from "../../components/CommunityPage/AdminDeleteComm";

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
  ) : (<div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "35%",
      marginRight: "2.31%",
    }}
  ><AdminDeleteComm communityId={communityId}></AdminDeleteComm></div>);
}
