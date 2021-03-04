import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import ban from "../../assets/ban.svg";
import { useAlert } from "react-alert";
import Api from "../../helpers/Api";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from "@material-ui/core";
  import { withStyles } from "@material-ui/core/styles";

export default function ViewMembersRow({ member , refresh, setRefresh}) {
  const alert = useAlert();
  const { communityId } = useParams();
  const [currentCommunity, setCurrentCommunity] = useState({});


  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      loadData(communityId);
    }
  }, [communityId]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function loadData(communityId) {
    Api.getCommunityById(communityId, currentUser)
      .done((currentCommunity) => {
        console.log(currentCommunity);
        setCurrentCommunity(currentCommunity);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText("#3B21CB"),
      backgroundColor: "#3B21CB",
      "&:hover": {
        backgroundColor: "#260eab",
      },
    },
  }))(Button);

  return (
    <div className="container ">
      <div
        className="row"
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="col-md-3">
          <img
            className="img-fluid"
            src={member.profilePicture}
            alt="defaultDP"
          />
        </div>
        <div className="col-md-7 mb-1" style={{ fontSize: "18px" }}>
          {member.username}
        </div>
        {/* <div className="col-md-2">
          <img
            style={{
              height: "25px",
              width: "25px",
            }}
            src={ban}
            alt="banLogo"
            onClick={banPerson}
          />
        </div> */}
      </div>
    </div>
  );
}
