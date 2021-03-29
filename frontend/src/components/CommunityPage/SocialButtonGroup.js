import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";
import Api from "../../helpers/Api";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);


export default function SocialButtonGroup({communityId, communityName, refresh, setRefresh}) {
  const alert = useAlert();

  //const [refresh, setRefresh] = useState(true);
  const [followingCommunities, setFollowingCommunities] = useState();
  const [joined, setJoined] = useState(false);
  const [confirmLeaveDialogOpen, setConfirmLeaveDialogOpen] = useState(
    false
  );

  const currentUser = useSelector((state) => state.currentUser);
  const isAdmin = useSelector((state) => state.isAdmin);
  useEffect(() => {
    Api.getFollowingCommunities(currentUser)
      .done((followObjects) => {
        let followingFlag = false;
        for (var i = 0; i < followObjects.length; i++) {
          if (Number(followObjects[i].id) === Number(communityId)) {
            followingFlag = true;
            console.log(followingFlag);
            setJoined(true);
            break;
          }
        }
        if (followingFlag === false) {
          setJoined(false);
        }
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [refresh]);

  console.log(joined);

  function handleLeaveDialogOpen() {
    setConfirmLeaveDialogOpen(true);
  }

  function handleLeaveDialogClose() {
    setConfirmLeaveDialogOpen(false);
  }

  function handleJoin() {
    Api.followCommunity(communityId, currentUser)
      .done(() => {
        setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleLeave() {
    Api.unfollowCommunity(communityId, currentUser)
      .done(() => {
        setRefresh(!refresh);
        handleLeaveDialogClose();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }
  

  return isAdmin == false ? (
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
      {joined === false ? (
        <ColorButton
          style={{
            height: "40px",
            width: "160px",
            outline: "none",
            marginRight: "3%",
          }}
          variant="contained"
          color="primary"
          onClick={handleJoin}
        >
          Join
        </ColorButton>
      ) : (
        <Button
          style={{
            height: "40px",
            width: "160px",
            outline: "none",
            marginRight: "3%",
          }}
          variant="contained"
          onClick={handleLeaveDialogOpen}
        >
          Joined
        </Button>
      )}
      
      <Dialog
        open={confirmLeaveDialogOpen}
        onClose={handleLeaveDialogClose}
        aria-labelledby="confirm-leave-dialog-title"
        aria-describedby="confirm-leave-dialog-description"
      >
        <DialogTitle id="confirm-leave-dialog-title">
          Leave {communityName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-leave-dialog-description">
            Do you want to leave {communityName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ outline: "none" }}
            onClick={handleLeaveDialogClose}
          >
            Cancel
          </Button>
          <ColorButton
            style={{ outline: "none" }}
            onClick={handleLeave}
            color="primary"
            variant="contained"
            autoFocus
          >
            Leave
          </ColorButton>
        </DialogActions>
      </Dialog>
    </div>
  ) : ("");
}
