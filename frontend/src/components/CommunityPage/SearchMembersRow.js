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

export default function SearchMembersRow({ member , refresh, setRefresh}) {
  const alert = useAlert();
  const { communityId } = useParams();

  const [currentCommunity, setCurrentCommunity] = useState({});

  const banPerson = () => {
    openBanPersonModal();
  };

  const [confirmBanDialogOpen, setConfirmBanDialogOpen] = React.useState(false);

  function openBanPersonModal() {
    setConfirmBanDialogOpen(true);
  }

  function closeBanPersonModal() {
    setConfirmBanDialogOpen(false);
  }

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

  function handleBanPerson() {
    if (currentCommunity.owner.id === currentUser) {
      Api.banPersonFromCommunity(communityId, member.id, currentUser.toString())
        .done(() => {
          alert.show("Ban success!");
          setRefresh(!refresh);
          closeBanPersonModal();
        })
        .fail((xhr, status, error) => {
          console.log(xhr.responseJSON.error);
          if (xhr.responseJSON.error === "Missing Community parameter") {
            alert.show("Please include the community id");
          }
          if (xhr.responseJSON.error === "Missing Person ID parameter") {
            alert.show("Please include the person id");
          }
          if (xhr.responseJSON.error === "Person already banned") {
            alert.show("Person already banned");
          }
          if (xhr.responseJSON.error === "The owner of the community cannot be banned") {
            alert.show("The owner of the community cannot be banned");
          }
        });
    } else {
      alert.show("Invalid Request by non-owner!");
    }
  }

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
        <div className="col-md-2">
          <img
            style={{
              height: "25px",
              width: "25px",
            }}
            src={ban}
            alt="banLogo"
            onClick={banPerson}
          />
          <Dialog
                open={confirmBanDialogOpen}
                onClose={closeBanPersonModal}
                aria-labelledby="confirm-delete-dialog-title"
                aria-describedby="confirm-delete-dialog-description"
              >
                <DialogTitle id="confirm-delete-dialog-title">
                  Remove {member.username}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="confirm-delete-dialog-description">
                    Are you sure you want to remove user {member.username}?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    style={{ outline: "none" }}
                    onClick={closeBanPersonModal}
                  >
                    Cancel
                  </Button>
                  <ColorButton
                    style={{ outline: "none" }}
                    onClick={handleBanPerson}
                    color="primary"
                    variant="contained"
                    autoFocus
                  >
                    Remove
                  </ColorButton>
                </DialogActions>
              </Dialog>
        </div>
      </div>
    </div>
  );
}
