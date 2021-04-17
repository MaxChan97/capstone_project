import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { Link } from "react-router-dom";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import defaultDP from "../assets/Default Dp logo.svg";
import moment from "moment";
import { useSelector } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
} from "@material-ui/core";
import { streamRefreshListener } from "../helpers/FirebaseApi";
import ReactHashtag from "react-hashtag";
import ReactPlayer from "react-player";
import RecommendedVideosCardList from "../components/VideosPage/RecommendedVideosCardList";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  chip: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    "& > *": {
      marginRight: theme.spacing(0.5),
    },
  },
}));

export default function VideoPage() {
  let { videoId } = useParams();
  const alert = useAlert();
  const classes = useStyles();
  const currentUser = useSelector((state) => state.currentUser);
  const history = useHistory();

  const [advertisements, setAdvertisements] = useState(null);
  const [adToShow, setAdToShow] = useState([]);
  const [shownAd, setShownAd] = useState();
  const [currentPerson, setCurrentPerson] = useState(null);
  const [video, setVideo] = useState();
  const [videos, setVideos] = useState();
  const [numFollowers, setNumFollowers] = useState(0);

  const [following, setFollowing] = useState(false);
  const [subscription, setSubscription] = useState();
  const [subscriptionStatus, setSubscriptionStatus] = useState("NotSubscribed");
  const [refresh, setRefresh] = useState(true);
  const [videoRefresh, setVideoRefresh] = useState([]);

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

  useEffect(() => {
    Api.addView(videoId)
      .done(() => {
        Api.getVideo(videoId)
          .done((video) => {
            setVideo(video);
            Api.getAllVideos()
              .done((videos) => {
                let vs = videos.filter(
                  (v) => v.id != video.id && isRelated(v, video)
                );
                setVideos(vs);
              })
              .fail((xhr, status, error) => {
                alert.show(xhr.responseJSON.error);
              });
          })
          .fail((xhr, status, error) => {
            alert.show(xhr.responseJSON.error);
          });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
    Api.getAllAdvertisement()
      .done((list) => {
        setAdvertisements(list);
        Api.getPersonById(currentUser)
          .then((person) => {
            setCurrentPerson(person);
            targetAd(list, person);
          })
      })
      .fail(() => {
        //alert.show("Unable to load!");
      });
  }, [refresh]);

  useEffect(() => {
    const unsubscribe = streamRefreshListener(setVideoRefresh);
    const test = () => {
      return unsubscribe();
    };
    return test;
  }, []);

  useEffect(() => {
    if (video != undefined) {
      Api.getFollowers(video.author.id)
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
      Api.getSubscribers(video.author.id)
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
      Api.isSubscribed(currentUser, video.author.id)
        .done((status) => {
          setSubscriptionStatus(status.subscriptionStatus);
        })
        .fail((xhr, status, error) => {
          alert.show(xhr.responseJSON.error);
        });
    }
  }, [video, videoRefresh, refresh]);

  function isRelated(v1, v2) {
    let t1 = v1.relatedTopics;
    let t2 = v2.relatedTopics;
    let isRelated = false;
    for (let t of t1) {
      if (t2.includes(t)) {
        isRelated = true;
        break;
      }
    }
    return isRelated;
  }

  function targetAd(list, person) {
    var found = false;
    for (var i = list.length - 1; i >= 0; i--) {
      if (
        person.topicInterests.some((interest) =>
          list[i].topics.includes(interest)
        )
      ) {
        // got match in interest
        // add to recommended ads
        found = true;
        adToShow.push(list[i]);
      }
    }
    //default advert
    if (found == false) {
      adToShow.push(list[1]);
    }

    var randomAdId = Math.floor(getRandomArbitrary(0, adToShow.length));
    console.log(randomAdId);
    console.log(adToShow[randomAdId]);
    setShownAd(adToShow[randomAdId]);
    console.log(shownAd)
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

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
    Api.followPerson(currentUser, video.author.id)
      .done(() => {
        setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleUnfollow() {
    Api.unfollowPerson(currentUser, video.author.id)
      .done(() => {
        setRefresh(!refresh);
        handleUnfollowDialogClose();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleSubscribe() {
    Api.subscribeToPerson(currentUser, video.author.id)
      .done(() => {
        if (following === false) {
          Api.followPerson(currentUser, video.author.id)
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
    Api.unsubscribeFromPerson(currentUser, video.author.id)
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
          Unfollow {video.author.username}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-unfollow-dialog-description">
            Do you want to unfollow {video.author.username}?
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
          Subscribe to {video.author.username}
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
              {video.author.pricingPlan != undefined ? (
                <p style={{ color: "#3B21CB", fontWeight: "bold" }}>
                  SGD {video.author.pricingPlan.toFixed(2)}/month
                </p>
              ) : (
                ""
              )}
            </div>
            <p style={{ marginBottom: "2px" }}>
              Ad-free viewing on {video.author.username}'s profile.
            </p>
            <p style={{ marginBottom: "2px" }}>
              Chat during Subscriber-Only Mode.
            </p>
            <p>Access to exclusive content by {video.author.username}</p>
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
            Unsubscribe from {video.author.username}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-unsubscribe-dialog-description">
              Do you want to unsubscribe from {video.author.username}?
            </DialogContentText>
            <DialogContentText>
              Your subscription benefits will expire on{" "}
              {moment(subscription.endDate.slice(0, -5)).format(
                "DD/MM/YYYY hh:mm:ss a"
              )}{" "}
              if you unsubscribe
            </DialogContentText>
            <DialogContentText>
              You will still be following {video.author.username} after
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
            Resubscribe to {video.author.username}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-resubscribe-dialog-description">
              Do you want to resubscribe to {video.author.username}?
            </DialogContentText>
            <DialogContentText>
              Your subscription benefits will expire on{" "}
              {moment(subscription.endDate.slice(0, -5)).format(
                "DD/MM/YYYY hh:mm:ss a"
              )}{" "}
              if you don't
            </DialogContentText>
            {video.author.pricingPlan != undefined ? (
              <DialogContentText>
                You will continue to be charged SGD{" "}
                {video.author.pricingPlan.toFixed(2)}
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

  function toTitleCase(str) {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] =
        frags[i].charAt(0).toUpperCase() + frags[i].substr(1).toLowerCase();
    }
    return frags.join(" ");
  }

  function renderVideoInfo(video) {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Link to={"/profile/" + video.author.id}>
          <img
            className="rounded-circle"
            style={{ height: "38px", marginRight: "8px" }}
            src={video.author.profilePicture || defaultDP}
          />
        </Link>
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
              <Link
                to={"/profile/" + video.author.id}
                style={{ color: "inherit" }}
              >
                <p style={{ margin: 0, lineHeight: 1, fontWeight: "bold" }}>
                  {video.author.username}
                </p>
              </Link>
              <p style={{ margin: 0, lineHeight: 1 }}>
                {numFollowers} followers
              </p>
              <p style={{ margin: 0, marginTop: "18px", lineHeight: 1 }}>
                <ReactHashtag
                  renderHashtag={(hashtagValue) => (
                    <span
                      style={{ color: "#3B21CB", cursor: "pointer" }}
                      onClick={() =>
                        history.push("/trend/" + hashtagValue.slice(1))
                      }
                    >
                      <b>{hashtagValue}</b>
                    </span>
                  )}
                >
                  {video.description}
                </ReactHashtag>
              </p>
              <b>Related Topics</b>
              <div component="ul" className={classes.chip}>
                {video.relatedTopics.map((topics, index) => (
                  <Chip
                    label={toTitleCase(topics)}
                    key={index}
                    style={{ backgroundColor: "#FFFFFF" }}
                  />
                ))}
              </div>
            </div>
            {currentUser && currentUser != video.author.id && (
              <div style={{ display: "flex", flexDirection: "row" }}>
                {renderFollowButton()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return video && advertisements ? (
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
          <ReactPlayer
            url={video.fileUrl}
            controls={true}
            playing={true}
            muted={true}
            width={750}
          />
          <p
            style={{
              margin: 0,
              marginTop: "16px",
              lineHeight: 1,
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            <ReactHashtag
              renderHashtag={(hashtagValue) => (
                <span
                  style={{ color: "#3B21CB", cursor: "pointer" }}
                  onClick={() =>
                    history.push("/trend/" + hashtagValue.slice(1))
                  }
                >
                  <b>{hashtagValue}</b>
                </span>
              )}
            >
              {video.title}
            </ReactHashtag>
          </p>
          <p
            style={{
              margin: 0,
              marginTop: "6px",
              marginBottom: "16px",
              lineHeight: 1,
            }}
          >
            {video.noOfViews} views
          </p>
          <hr style={{ borderTop: "1px solid #D0D0D0", margin: 0 }} />
          <div style={{ marginTop: "16px" }}>{renderVideoInfo(video)}</div>
          <br></br>
          {subscriptionStatus === "NotSubscribed" && advertisements.length > 0 && shownAd != undefined? (
            <img
              className="mx-auto d-block"
              width="750px"
              src={shownAd.image}
            />
          ) : ("")}
          <br></br>
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
          <RecommendedVideosCardList videos={videos} />
        </div>
      </div>
      {renderUnFollowDialog()}
      {renderSubscribeDialog()}
      {renderUnsubscribeDialog()}
      {renderResubscribeDialog()}
    </div>
  ) : (
    ""
  );
}
