import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import chatLogo from "../../../assets/Chat logo.svg";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Api from "../../../helpers/Api";
import { useAlert } from "react-alert";
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

export default function SocialButtonGroup({ id, username }) {
  const alert = useAlert();

  const [refresh, setRefresh] = useState(true);
  const [following, setFollowing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const [confirmUnfollowDialogOpen, setConfirmUnfollowDialogOpen] = useState(
    false
  );
  const [confirmSubscribeDialogOpen, setConfirmSubscribeDialogOpen] = useState(
    false
  );
  const [
    confirmUnsubscribeDialogOpen,
    setConfirmUnsubscribeDialogOpen,
  ] = useState(false);

  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    Api.getFollowers(id)
      .done((followObjects) => {
        let followingFlag = false;
        for (var i = 0; i < followObjects.length; i++) {
          if (followObjects[i].follower.id === currentUser) {
            followingFlag = true;
            setFollowing(true);
            break;
          }
        }
        if (followingFlag === false) {
          setFollowing(false);
        }
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [refresh]);

  useEffect(() => {
    Api.getSubscribers(id)
      .done((subscriptionObjects) => {
        let subscribedFlag = false;
        for (var i = 0; i < subscriptionObjects.length; i++) {
          if (subscriptionObjects[i].subscriber.id === currentUser) {
            subscribedFlag = true;
            setSubscribed(true);
            break;
          }
        }
        if (subscribedFlag === false) {
          setSubscribed(false);
        }
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [refresh]);

  function handleUnfollowDialogOpen() {
    setConfirmUnfollowDialogOpen(true);
  }

  function handleUnfollowDialogClose() {
    setConfirmUnfollowDialogOpen(false);
  }

  function handleSubscribeDialogOpen() {
    setConfirmSubscribeDialogOpen(true);
  }

  function handleSubscribeDialogClose() {
    setConfirmSubscribeDialogOpen(false);
  }

  function handleUnsubscribeDialogOpen() {
    setConfirmUnsubscribeDialogOpen(true);
  }

  function handleUnsubscribeDialogClose() {
    setConfirmUnsubscribeDialogOpen(false);
  }

  function handleFollow() {
    Api.followPerson(currentUser, id)
      .done(() => {
        setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleUnfollow() {
    Api.unfollowPerson(currentUser, id)
      .done(() => {
        setRefresh(!refresh);
        handleUnfollowDialogClose();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleSubscribe() {
    Api.subscribeToPerson(currentUser, id)
      .done(() => {
        setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleUnsubscribe() {
    Api.unsubscribeFromPerson(currentUser, id)
      .done(() => {
        setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

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
        <Button
          style={{ height: "40px", width: "25px", outline: "none" }}
          variant="contained"
        >
          <img src={chatLogo} alt="chatLogo" />
        </Button>
      </Link>
      {following === false ? (
        <ColorButton
          style={{
            height: "40px",
            width: "160px",
            outline: "none",
            marginRight: "3%",
          }}
          variant="contained"
          color="primary"
          onClick={handleFollow}
        >
          Follow
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
          onClick={handleUnfollowDialogOpen}
        >
          Following
        </Button>
      )}
      {subscribed === false ? (
        <Button
          style={{ height: "40px", width: "160px", outline: "none" }}
          variant="outlined"
          color="primary"
        >
          Subscribe
        </Button>
      ) : (
        <Button
          style={{ height: "40px", width: "160px", outline: "none" }}
          variant="contained"
        >
          Subscribed
        </Button>
      )}
      <Dialog
        open={confirmUnfollowDialogOpen}
        onClose={handleUnfollowDialogClose}
        aria-labelledby="confirm-unfollow-dialog-title"
        aria-describedby="confirm-unfollow-dialog-description"
      >
        <DialogTitle id="confirm-unfollow-dialog-title">
          Unfollow {username}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-unfollow-dialog-description">
            Do you want to unfollow {username}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ outline: "none" }}
            onClick={handleUnfollowDialogClose}
          >
            Cancel
          </Button>
          <ColorButton
            style={{ outline: "none" }}
            onClick={handleUnfollow}
            color="primary"
            variant="contained"
            autoFocus
          >
            Unfollow
          </ColorButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
