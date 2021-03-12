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

export default function FollowingCardItem({ follow, currentUser }) {
  const styles = useStyles();
  const alert = useAlert();
  const publisher = follow["publisher"];

  const [followerCount, setFollowerCount] = useState([]);
  const [following, setFollowing] = useState(true);
  const [refresh, setRefresh] = useState(true);

  const [confirmUnfollowDialogOpen, setConfirmUnfollowDialogOpen] = useState(
    false
  );

  useEffect(() => {
    Api.getFollowers(publisher.id)
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

  function handleFollow() {
    Api.followPerson(currentUser, publisher.id)
      .done(() => {
        setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleUnfollow() {
    Api.unfollowPerson(currentUser, publisher.id)
      .done(() => {
        setRefresh(!refresh);
        handleUnfollowDialogClose();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleUnfollowDialogOpen() {
    setConfirmUnfollowDialogOpen(true);
  }

  function handleUnfollowDialogClose() {
    setConfirmUnfollowDialogOpen(false);
  }

  function renderSocialButton() {
    if (following === true) {
      return (
        <Button
          style={{
            height: "30px",
            width: "110px",
            outline: "none",
            marginTop: "8px",
          }}
          variant="contained"
          onClick={handleUnfollowDialogOpen}
        >
          Following
        </Button>
      );
    } else {
      return (
        <ColorButton
          style={{
            height: "30px",
            width: "110px",
            outline: "none",
            marginTop: "8px",
          }}
          variant="contained"
          color="primary"
          onClick={handleFollow}
        >
          Follow
        </ColorButton>
      );
    }
  }

  function renderUnfollowDialog() {
    return (
      <Dialog
        open={confirmUnfollowDialogOpen}
        onClose={handleUnfollowDialogClose}
        aria-labelledby="confirm-unfollow-dialog-title"
        aria-describedby="confirm-unfollow-dialog-description"
      >
        <DialogTitle id="confirm-unfollow-dialog-title">
          Unfollow {publisher.username}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-unfollow-dialog-description">
            Do you want to unfollow {publisher.username}?
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
            {renderUnfollowDialog()}
          </div>
        </Box>
      </CardContent>
    </Card>
  );
}
