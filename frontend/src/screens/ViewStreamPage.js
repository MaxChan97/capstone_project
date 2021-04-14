import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import defaultDP from "../assets/Default Dp logo.svg";
import moment from "moment";
import { useSelector } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import LiveChatBox from "../components/ViewStreamPage/LiveChatBox";
import LivePollBox from "../components/ViewStreamPage/LivePollBox";
import { streamRefreshListener } from "../helpers/FirebaseApi";
import { db } from "../firebase";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function ViewStreamPage() {
  const { streamId } = useParams();
  const alert = useAlert();
  const currentUser = useSelector((state) => state.currentUser);
  const history = useHistory();

  const [stream, setStream] = useState();
  const [numFollowers, setNumFollowers] = useState(0);

  const [following, setFollowing] = useState(false);
  const [subscription, setSubscription] = useState();
  const [subscriptionStatus, setSubscriptionStatus] = useState("NotSubscribed");

  const [refresh, setRefresh] = useState(true);

  const [streamRefresh, setStreamRefresh] = useState([]);

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
  const [streamEndedDialogOpen, setStreamEndedDialogOpen] = useState(false);

  useEffect(() => {
    loadData(streamId);
  }, [streamRefresh]);

  useEffect(() => {
    const unsubscribe = streamRefreshListener(setStreamRefresh);
    const test = () => {
      return unsubscribe();
    };
    return test;
  }, []);

  useEffect(() => {
    Api.handleEnterStream(streamId, currentUser)
      .then(() => {
        db.collection("StreamRefresh")
          .doc("en9EpFajcUExC4dvcF45")
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection("StreamRefresh")
                .doc("en9EpFajcUExC4dvcF45")
                .update({ streamRefresh: !doc.data().streamRefresh });
            }
          });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    const cleanup = () => {
      Api.handleExitStream(streamId, currentUser)
        .then(() => {
          db.collection("StreamRefresh")
            .doc("en9EpFajcUExC4dvcF45")
            .get()
            .then((doc) => {
              if (doc.exists) {
                db.collection("StreamRefresh")
                  .doc("en9EpFajcUExC4dvcF45")
                  .update({ streamRefresh: !doc.data().streamRefresh });
              }
            });
        })
        .fail((xhr, status, error) => {
          alert.show(xhr.responseJSON.error);
        });
    };
    return cleanup;
  }, []);

  function loadData(streamId) {
    Api.getStreamById(streamId)
      .then((stream) => {
        if (stream.hasEnded === true) {
          handleStreamEndedDialogOpen();
        }
        setStream(stream);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  useEffect(() => {
    if (stream != undefined) {
      Api.getFollowers(stream.streamer.id)
        .done((followObjects) => {
          setNumFollowers(followObjects.length);
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
      Api.getSubscribers(stream.streamer.id)
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
      Api.isSubscribed(currentUser, stream.streamer.id)
        .done((status) => {
          setSubscriptionStatus(status.subscriptionStatus);
        })
        .fail((xhr, status, error) => {
          alert.show(xhr.responseJSON.error);
        });
    }
  }, [stream, refresh]);

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

  function handleStreamEndedDialogOpen() {
    setStreamEndedDialogOpen(true);
  }

  function handleStreamEndedDialogClose() {
    setStreamEndedDialogOpen(false);
  }

  function handleFollow() {
    Api.followPerson(currentUser, stream.streamer.id)
      .done(() => {
        setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleUnfollow() {
    Api.unfollowPerson(currentUser, stream.streamer.id)
      .done(() => {
        setRefresh(!refresh);
        handleUnfollowDialogClose();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleSubscribe() {
    Api.subscribeToPerson(currentUser, stream.streamer.id)
      .done(() => {
        if (following === false) {
          Api.followPerson(currentUser, stream.streamer.id)
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
    Api.unsubscribeFromPerson(currentUser, stream.streamer.id)
      .done(() => {
        setRefresh(!refresh);
        handleUnsubscribeDialogClose();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
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
          Unfollow {stream.streamer.username}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-unfollow-dialog-description">
            Do you want to unfollow {stream.streamer.username}?
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
          Subscribe to {stream.streamer.username}
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
              {stream.streamer.pricingPlan != undefined ? (
                <p style={{ color: "#3B21CB", fontWeight: "bold" }}>
                  SGD {stream.streamer.pricingPlan.toFixed(2)}/month
                </p>
              ) : (
                ""
              )}
            </div>
            <p style={{ marginBottom: "2px" }}>
              Ad-free viewing on {stream.streamer.username}'s profile.
            </p>
            <p style={{ marginBottom: "2px" }}>
              Chat during Subscriber-Only Mode.
            </p>
            <p>Access to exclusive content by {stream.streamer.username}</p>
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
            Unsubscribe from {stream.streamer.username}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-unsubscribe-dialog-description">
              Do you want to unsubscribe from {stream.streamer.username}?
            </DialogContentText>
            <DialogContentText>
              Your subscription benefits will expire on{" "}
              {moment(subscription.endDate.slice(0, -5)).format(
                "DD/MM/YYYY hh:mm:ss a"
              )}{" "}
              if you unsubscribe
            </DialogContentText>
            <DialogContentText>
              You will still be following {stream.streamer.username} after
              unsubscribing.
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
            Resubscribe to {stream.streamer.username}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-resubscribe-dialog-description">
              Do you want to resubscribe to {stream.streamer.username}?
            </DialogContentText>
            <DialogContentText>
              Your subscription benefits will expire on{" "}
              {moment(subscription.endDate.slice(0, -5)).format(
                "DD/MM/YYYY hh:mm:ss a"
              )}{" "}
              if you don't
            </DialogContentText>
            {stream.streamer.pricingPlan != undefined ? (
              <DialogContentText>
                You will continue to be charged SGD{" "}
                {stream.streamer.pricingPlan.toFixed(2)}
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

  function renderStreamEndedDialog() {
    return (
      <Dialog open={streamEndedDialogOpen}>
        <DialogTitle>Stream ended</DialogTitle>
        <DialogContent>Please click ok to navigate to your feed</DialogContent>
        <DialogActions>
          <ColorButton
            style={{ outline: "none" }}
            onClick={() => {
              history.push("/feed");
            }}
            color="primary"
            variant="contained"
            autoFocus
          >
            ok
          </ColorButton>
        </DialogActions>
      </Dialog>
    );
  }

  function renderFollowButton() {
    if (following === false) {
      return (
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
      );
    } else {
      return (
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
      );
    }
  }

  function renderSubscribeButton() {
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

  function renderStreamInfo(stream) {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <img
          className="rounded-circle"
          style={{ height: "38px", marginRight: "8px" }}
          src={stream.streamer.profilePicture || defaultDP}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: "2px",
              }}
            >
              <p style={{ margin: 0, lineHeight: 1, fontWeight: "bold" }}>
                {stream.streamer.username}
              </p>
              <p style={{ margin: 0, lineHeight: 1 }}>
                {numFollowers} followers
              </p>
              <p style={{ margin: 0, marginTop: "18px", lineHeight: 1 }}>
                {stream.description}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {renderFollowButton()}
              {renderSubscribeButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return stream ? (
    <div className="content-wrapper">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "18px",
            paddingLeft: "18px",
            width: "750px",
          }}
        >
          <iframe
            src={stream.accessUrl}
            width="750px"
            height="450px"
            frameborder="0"
            scrolling="no"
            allowfullscreen="true"
          ></iframe>
          <p
            style={{
              margin: 0,
              marginTop: "16px",
              lineHeight: 1,
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            {stream.title}
          </p>
          <p
            style={{
              margin: 0,
              marginTop: "6px",
              marginBottom: "16px",
              lineHeight: 1,
            }}
          >
            {stream.viewerCount} watching now
          </p>
          <hr style={{ borderTop: "1px solid #D0D0D0", margin: 0 }} />
          <div style={{ marginTop: "16px" }}>{renderStreamInfo(stream)}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: "1",
            alignItems: "center",
            paddingTop: "18px",
            paddingRight: "18px",
          }}
        >
          <LiveChatBox streamId={stream.id} />
          <LivePollBox streamId={stream.id} />
        </div>
      </div>
      {renderUnFollowDialog()}
      {renderSubscribeDialog()}
      {renderUnsubscribeDialog()}
      {renderResubscribeDialog()}
      {renderStreamEndedDialog()}
    </div>
  ) : (
    ""
  );
}
