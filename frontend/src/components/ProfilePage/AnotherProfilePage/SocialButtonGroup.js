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
import moment from "moment";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function SocialButtonGroup({
  id,
  username,
  pricingPlan,
  refresh,
  setRefresh,
  anotherPerson,
}) {
  const alert = useAlert();
  const isAdmin = useSelector((state) => state.isAdmin);
  const [following, setFollowing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscription, setSubscription] = useState();
  const [subscriptionStatus, setSubscriptionStatus] = useState("NotSubscribed");

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
  const [
    confirmResubscribeDialogOpen,
    setConfirmResubscribeDialogOpen,
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

  // wait for Shawns endpoint
  useEffect(() => {
    Api.getSubscribers(id)
      .done((subscriptionObjects) => {
        let subscribedFlag = false;
        for (var i = 0; i < subscriptionObjects.length; i++) {
          if (subscriptionObjects[i].subscriber.id === currentUser) {
            subscribedFlag = true;
            //setSubscribed(true);
            console.log(subscriptionObjects[i]);
            setSubscription(subscriptionObjects[i]);
            break;
          }
        }
        if (subscribedFlag === false) {
          //setSubscribed(false);
        }
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [refresh]);

  useEffect(() => {
    Api.isSubscribed(currentUser, id)
      .done((status) => {
        setSubscriptionStatus(status.subscriptionStatus);
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

  function handleResubscribeDialogOpen() {
    setConfirmResubscribeDialogOpen(true);
  }

  function handleResubscribeDialogClose() {
    setConfirmResubscribeDialogOpen(false);
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
        if (following === false) {
          Api.followPerson(currentUser, id)
            .done(() => {
              setRefresh(!refresh);
              handleSubscribeDialogClose();
              handleResubscribeDialogClose();
            })
            .fail((xhr, status, error) => {
              alert.show(xhr.responseJSON.error);
            });
        } else {
          setRefresh(!refresh);
          handleSubscribeDialogClose();
          handleResubscribeDialogClose();
        }
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleUnsubscribe() {
    Api.unsubscribeFromPerson(currentUser, id)
      .done(() => {
        setRefresh(!refresh);
        handleUnsubscribeDialogClose();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function renderSubscribe() {
    if (subscriptionStatus === "Subscribed") {
      return (
        <Button
          style={{ height: "40px", width: "160px", outline: "none" }}
          variant="contained"
          onClick={handleUnsubscribeDialogOpen}
        >
          Subscribed
        </Button>
      );
    } else if (subscriptionStatus === "NotSubscribed") {
      return (
        <Button
          style={{ height: "40px", width: "160px", outline: "none" }}
          variant="outlined"
          color="primary"
          onClick={handleSubscribeDialogOpen}
        >
          Subscribe
        </Button>
      );
    } else {
      // this case is ReSubscribe
      if (subscription != undefined) {
        return (
          <div style={{ textAlign: "center" }}>
            <Button
              style={{ height: "40px", width: "160px", outline: "none" }}
              variant="outlined"
              color="primary"
              onClick={handleResubscribeDialogOpen}
            >
              Resubscribe
            </Button>
            <div style={{ width: "160px" }}>
              <p style={{ fontSize: "13px", color: "gray" }}>
                subscription till{" "}
                {moment(subscription.endDate.slice(0, -5)).format("DD/MM/YYYY")}
              </p>
            </div>
          </div>
        );
      }
    }
  }

  function renderChatButton() {
    if (anotherPerson.chatIsPaid === true) {
      if (subscriptionStatus !== "NotSubscribed") {
        return (
          <Link style={{ marginRight: "3%" }} to={"/chat/" + id}>
            <Button
              style={{ height: "40px", width: "25px", outline: "none" }}
              variant="contained"
            >
              <img src={chatLogo} alt="chatLogo" />
            </Button>
          </Link>
        );
      } else {
        return "";
      }
    } else {
      return (
        <Link style={{ marginRight: "3%" }} to={"/chat/" + id}>
          <Button
            style={{ height: "40px", width: "25px", outline: "none" }}
            variant="contained"
          >
            <img src={chatLogo} alt="chatLogo" />
          </Button>
        </Link>
      );
    }
  }

  function renderUnFollowDialog() {
    return (
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
    );
  }

  function renderSubscribeDialog() {
    return (
      <Dialog
        open={confirmSubscribeDialogOpen}
        onClose={handleSubscribeDialogClose}
        aria-labelledby="confirm-subscribe-dialog-title"
        aria-describedby="confirm-subscribe-dialog-description"
      >
        <DialogTitle id="confirm-subscribe-dialog-title">
          Subscribe to {username}
        </DialogTitle>
        <DialogContent>
          <div style={{ minWidth: "450px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p style={{ fontWeight: "bold" }}>Benefits</p>
              {pricingPlan != undefined ? (
                <p style={{ color: "#3B21CB", fontWeight: "bold" }}>
                  SGD {pricingPlan.toFixed(2)}/month
                </p>
              ) : (
                ""
              )}
            </div>
            <p style={{ marginBottom: "2px" }}>
              Ad-free viewing on {username}'s channel.
            </p>
            <p style={{ marginBottom: "2px" }}>
              Chat during Subscriber-Only Mode.
            </p>
            <p>Access to exclusive content by {username}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ outline: "none" }}
            onClick={handleSubscribeDialogClose}
          >
            Cancel
          </Button>
          <ColorButton
            style={{ outline: "none" }}
            onClick={handleSubscribe}
            color="primary"
            variant="contained"
            autoFocus
          >
            Subscribe
          </ColorButton>
        </DialogActions>
      </Dialog>
    );
  }

  function renderUnsubscribeDialog() {
    if (subscription != undefined) {
      return (
        <Dialog
          open={confirmUnsubscribeDialogOpen}
          onClose={handleUnsubscribeDialogClose}
          aria-labelledby="confirm-unsubscribe-dialog-title"
          aria-describedby="confirm-unsubscribe-dialog-description"
        >
          <DialogTitle id="confirm-unsubscribe-dialog-title">
            Unsubscribe from {username}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-unsubscribe-dialog-description">
              Do you want to unsubscribe from {username}?
            </DialogContentText>
            <DialogContentText>
              Your subscription benefits will expire on{" "}
              {moment(subscription.endDate.slice(0, -5)).format(
                "DD/MM/YYYY hh:mm:ss a"
              )}{" "}
              if you unsubscribe
            </DialogContentText>
            <DialogContentText>
              You will still be following {username} after unsubscribing.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ outline: "none" }}
              onClick={handleUnsubscribeDialogClose}
            >
              Cancel
            </Button>
            <ColorButton
              style={{ outline: "none" }}
              onClick={handleUnsubscribe}
              color="primary"
              variant="contained"
              autoFocus
            >
              Unsubscribe
            </ColorButton>
          </DialogActions>
        </Dialog>
      );
    }
  }

  function renderResubscribeDialog() {
    if (subscription != undefined) {
      return (
        <Dialog
          open={confirmResubscribeDialogOpen}
          onClose={handleResubscribeDialogClose}
          aria-labelledby="confirm-resubscribe-dialog-title"
          aria-describedby="confirm-resubscribe-dialog-description"
        >
          <DialogTitle id="confirm-resubscribe-dialog-title">
            Resubscribe to {username}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-resubscribe-dialog-description">
              Do you want to resubscribe to {username}?
            </DialogContentText>
            <DialogContentText>
              Your subscription benefits will expire on{" "}
              {moment(subscription.endDate.slice(0, -5)).format(
                "DD/MM/YYYY hh:mm:ss a"
              )}{" "}
              if you don't
            </DialogContentText>
            {pricingPlan != undefined ? (
              <DialogContentText>
                You will continue to be charged SGD {pricingPlan.toFixed(2)}
                /month when your subscription expires if you do
              </DialogContentText>
            ) : (
              ""
            )}
          </DialogContent>
          <DialogActions>
            <Button
              style={{ outline: "none" }}
              onClick={handleResubscribeDialogClose}
            >
              Cancel
            </Button>
            <ColorButton
              style={{ outline: "none" }}
              onClick={handleSubscribe}
              color="primary"
              variant="contained"
              autoFocus
            >
              Resubscribe
            </ColorButton>
          </DialogActions>
        </Dialog>
      );
    }
  }

  return isAdmin == false ? (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: "22px",
        width: "35%",
        marginRight: "2.31%",
      }}
    >
      {renderChatButton()}
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
      {renderSubscribe()}
      {renderUnFollowDialog()}
      {renderSubscribeDialog()}
      {renderUnsubscribeDialog()}
      {renderResubscribeDialog()}
    </div>
  ):("");
}
