import React, { useEffect, useState } from "react";
import defaultDP from "../../../assets/Default Dp logo.svg";
import Api from "../../../helpers/Api";
import { useAlert } from "react-alert";
import {
  Card,
  Box,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import moment from "moment";

const useStyles = makeStyles({
  root: {
    height: "auto",
    width: `${80 / 4}%`,
    textAlign: "start",
    marginLeft: "2.5%",
    marginRight: "2.5%",
    marginBottom: "1.2%",
    borderBottom: "3",
  },
  mainText: {
    fontSize: 22,
    margin: 0,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 17,
    color: "gray",
    margin: 0,
  },
});

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function SubscribingCardItem({ subscribe, currentUser }) {
  const styles = useStyles();
  const alert = useAlert();
  const publisher = subscribe["publisher"];

  const [followerCount, setFollowerCount] = useState([]);
  const [subscription, setSubscription] = useState();
  const [subscriptionStatus, setSubscriptionStatus] = useState("Subscribed");
  const [refresh, setRefresh] = useState(true);

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

  useEffect(() => {
    Api.isSubscribed(currentUser, publisher.id)
      .done((status) => {
        setSubscriptionStatus(status.subscriptionStatus);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [refresh, publisher]);

  useEffect(() => {
    Api.getSubscribers(publisher.id)
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
  }, [refresh, publisher]);

  useEffect(() => {
    loadData(publisher);
  }, [refresh, publisher]);

  function loadData(publisher) {
    Api.getFollowers(publisher["id"])
      .done((data) => {
        setFollowerCount(data.length);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleSubscribe() {
    Api.subscribeToPerson(currentUser, publisher.id)
      .done(() => {
        setRefresh(!refresh);
        handleSubscribeDialogClose();
        handleResubscribeDialogClose();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleUnsubscribe() {
    Api.unsubscribeFromPerson(currentUser, publisher.id)
      .done(() => {
        setRefresh(!refresh);
        handleUnsubscribeDialogClose();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
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

  function renderSocialButton() {
    if (subscriptionStatus === "Subscribed") {
      return (
        <Button
          style={{
            height: "30px",
            width: "110px",
            outline: "none",
            marginTop: "8px",
          }}
          variant="contained"
          onClick={handleUnsubscribeDialogOpen}
        >
          Subscribed
        </Button>
      );
    } else if (subscriptionStatus === "NotSubscribed") {
      return (
        <Button
          style={{
            height: "30px",
            width: "110px",
            outline: "none",
            marginTop: "8px",
          }}
          variant="outlined"
          color="primary"
          onClick={handleSubscribeDialogOpen}
        >
          Subscribe
        </Button>
      );
    } else {
      // subscriptionStatus === "ReSubscribe"
      if (subscription != undefined) {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              style={{
                height: "30px",
                width: "118px",
                outline: "none",
                marginTop: "8px",
              }}
              variant="outlined"
              color="primary"
              onClick={handleResubscribeDialogOpen}
            >
              Resubscribe
            </Button>
            <p style={{ fontSize: "13px", color: "gray" }}>
              subscription till{" "}
              {moment(subscription.endDate.slice(0, -5)).format("DD/MM/YYYY")}
            </p>
          </div>
        );
      }
    }
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
          Subscribe to {publisher.username}
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
              {publisher.pricingPlan != undefined ? (
                <p style={{ color: "#3B21CB", fontWeight: "bold" }}>
                  SGD {publisher.pricingPlan.toFixed(2)}/month
                </p>
              ) : (
                ""
              )}
            </div>
            <p style={{ marginBottom: "2px" }}>
              Ad-free viewing on {publisher.username}'s channel.
            </p>
            <p style={{ marginBottom: "2px" }}>
              Chat during Subscriber-Only Mode.
            </p>
            <p>Access to exclusive content by {publisher.username}</p>
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
            Unsubscribe from {publisher.username}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-unsubscribe-dialog-description">
              Do you want to unsubscribe from {publisher.username}?
            </DialogContentText>
            <DialogContentText>
              Your subscription benefits will expire on{" "}
              {moment(subscription.endDate.slice(0, -5)).format(
                "DD/MM/YYYY hh:mm:ss a"
              )}{" "}
              if you unsubscribe
            </DialogContentText>
            <DialogContentText>
              You will still be following {publisher.username} after
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
            Resubscribe to {publisher.username}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-resubscribe-dialog-description">
              Do you want to resubscribe to {publisher.username}?
            </DialogContentText>
            <DialogContentText>
              Your subscription benefits will expire on{" "}
              {moment(subscription.endDate.slice(0, -5)).format(
                "DD/MM/YYYY hh:mm:ss a"
              )}{" "}
              if you don't
            </DialogContentText>
            {publisher.pricingPlan != undefined ? (
              <DialogContentText>
                You will continue to be charged SGD{" "}
                {publisher.pricingPlan.toFixed(2)}
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

  return (
    <Card className={styles.root}>
      <CardContent>
        <Box
          display="flex"
          flexDirection="column"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: 170,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link to={"/profile/" + publisher.id} style={{ color: "inherit" }}>
              <img
                className="img-fluid rounded-circle"
                style={{ height: "80px", width: "80px" }}
                src={publisher.profilePicture || defaultDP}
              />
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p style={{ marginBottom: "-8px" }} className={styles.mainText}>
                  {publisher.username}
                </p>
                <p className={styles.subText}>
                  {followerCount !== 1
                    ? followerCount + " followers"
                    : followerCount + " follower"}
                </p>
              </div>
            </Link>
            {renderSocialButton()}
            {renderSubscribeDialog()}
            {renderUnsubscribeDialog()}
            {renderResubscribeDialog()}
          </div>
        </Box>
      </CardContent>
    </Card>
  );
}
