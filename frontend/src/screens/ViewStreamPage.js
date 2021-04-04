import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
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

  const [stream, setStream] = useState();
  const [numFollowers, setNumFollowers] = useState(0);

  const [following, setFollowing] = useState(false);
  const [subscription, setSubscription] = useState();
  const [subscriptionStatus, setSubscriptionStatus] = useState("NotSubscribed");

  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    loadData(streamId);
  }, []);

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

  function loadData(streamId) {
    Api.getStreamById(streamId)
      .then((stream) => {
        setStream(stream);
        console.log(stream);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleUnfollowDialogOpen() {}

  function handleSubscribeDialogOpen() {}

  function handleUnsubscribeDialogOpen() {}

  function handleResubscribeDialogOpen() {}

  function handleFollow() {}

  function renderFollowButton() {
    if (following === false) {
      return (
        <ColorButton
          style={{
            height: "40px",
            width: "160px",
            outline: "none",
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
            {stream.viewers.length} watching now
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
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
