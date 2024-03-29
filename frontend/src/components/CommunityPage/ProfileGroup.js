import React, { useState } from "react";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { storage } from "../../firebase";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";
import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

var uuid = require("uuid");

export default function ProfileGroup({
  communityName,
  numMembers,
  communityPicture,
  communityId,
  personId,
  setCommunityPicture,
  refresh,
  setRefresh,
  communityOwner,
}) {
  const alert = useAlert();
  const isAdmin = useSelector((state) => state.isAdmin);
  const [editedPicture, setEditedPicture] = useState(false);
  const [tempPicture, setTempPicture] = useState(communityPicture);
  const [pictureProgress, setPictureProgress] = useState(0);
  const [editDialog, setShowEditDialog] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);

  const changeCommunityPictureHandler = (event) => {
    var oldName = event.target.files[0].name;
    var suffix = oldName.split(".")[1];
    var randomId = uuid.v4();
    var newName = randomId.toString() + "." + suffix;
    const uploadTask = storage
      .ref(`images/${newName}`)
      .put(event.target.files[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPictureProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(newName)
          .getDownloadURL()
          .then((url) => {
            setTempPicture(url);
            setEditedPicture(true);
          });
      }
    );
  };

  const handlePictureChange = () => {
    if (String(currentUser) === String(communityOwner.id)) {
      Api.editCommunityProfilePicture(communityId, tempPicture)
        .done(() => {
          alert.show("Community Picture updated successfully!");
          setRefresh(!refresh);
          setEditedPicture(false);
          handleEditDialogClose();
        })
        .fail((xhr, status, error) => {
          //alert.show("Something went wrong, please try again!");
          alert.show(xhr.responseJSON.error);
        });
    }
  };

  function handleEditDialogOpen() {
    setShowEditDialog(true);
  }

  function handleEditDialogClose() {
    setShowEditDialog(false);
    setEditedPicture(false);
  }

  function renderEditPictureDialog() {
    return (
      <Dialog open={editDialog}>
        <DialogTitle style={{ display: "flex", flexDirection: "column" }}>
          <b>Edit Community Picture</b>
        </DialogTitle>
        <DialogActions>
          {editedPicture === true ? (
            <div>
              {pictureProgress > 0 && pictureProgress < 100 ? (
                <div className="d-flex justify-content-center">
                  <CircularProgressWithLabel
                    value={pictureProgress}
                    size={80}
                  />
                </div>
              ) : (
                <img
                  style={{
                    resizeMode: "repeat",
                    height: 130,
                    width: 130,
                    borderRadius: "50%",
                    display: "block",
                    marginLeft: "18px",
                  }}
                  src={tempPicture}
                />
              )}
              <br />
              <div>
                <style type="text/css">
                  {`
                  .btn-custom {
                    background-color: #EAECEF;
                    color: black;
                  }
                  .btn-custom2 {
                    background-color: #3B21CB;
                    color: white;
                    marginLeft: 10px;
                  }

                `}
                </style>
                <Button
                  style={{
                    height: "35px",
                    width: "80px",
                    outline: "none",
                    float: "right",
                    marginRight: "45px",
                    marginBottom:"10px"
                  }}
                  onClick={handleEditDialogClose}
                  variant="custom"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePictureChange}
                  style={{
                    height: "35px",
                    width: "80px",
                    outline: "none",
                    marginRight: "10px",
                  }}
                  color="primary"
                  variant="custom2"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <img
                style={{
                  resizeMode: "repeat",
                  height: 130,
                  width: 130,
                  borderRadius: "50%",
                  display: "block",
                  marginLeft: "18px",
                }}
                src={communityPicture}
              />
              <br />
              <style type="text/css">
                {`
                  .btn-custom {
                    background-color: #EAECEF;
                    color: black;
                  }
                  .btn-custom2 {
                    background-color: #3B21CB;
                    color: white;
                    marginLeft: 10px;
                  }

                `}
              </style>
              <Button
                style={{
                  height: "35px",
                  width: "80px",
                  outline: "none",
                  float: "right",
                  marginRight: "45px",
                  marginBottom:"10px"
                }}
                variant="custom"
                onClick={handleEditDialogClose}
              >
                Cancel
              </Button>
              <Button
                style={{
                  height: "35px",
                  width: "80px",
                  outline: "none",
                  marginRight: "10px",
                }}
                variant="custom2"
              >
                <label
                  style={{
                    fontWeight: "400",
                  }}
                >
                  Upload
                  <input
                    id="pp"
                    type="file"
                    name="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={changeCommunityPictureHandler}
                  />
                </label>
              </Button>
            </div>
          )}
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "30%",
      }}
    >
      {isAdmin == false && String(communityOwner.id) === String(currentUser) ? (
        <div className="button-container">
          <img
            className="rounded-circle"
            style={{ height: "10vh" }}
            src={communityPicture}
          />
          <Button
            className="rounded-circle"
            style={{
              height: "35px",
              width: "35px",
              outline: "none",
              marginTop: "60px",
              marginLeft: "-30px",
              backgroundColor: "#EAECEF",
            }}
            variant="contained"
            color="primary"
            onClick={handleEditDialogOpen}
          >
            <i
              class="fas fa-camera"
              style={{ marginLeft: "-3px", marginTop: "-5px" }}
            ></i>
          </Button>
        </div>
      ) : (
        <div>
        <img
          className="rounded-circle"
          style={{ marginLeft:"150px", height: "10vh" }}
          src={communityPicture}
        />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "18px",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontWeight: "600",
            marginTop: "5px",
            marginBottom: "0px",
            fontSize: "30px",
          }}
        >
          {communityName}
        </p>

        <Link to={"/community/" + communityId + "/viewMembers"}>
          {/* <p style={{ paddingTop: "2px", color: "#6E757C", fontSize: "15px" }}> */}
          {numMembers !== 1 ? numMembers + " Members" : numMembers + " Member"}
          {/* </p> */}
        </Link>
      </div>
      {renderEditPictureDialog()}
    </div>
  );
}
