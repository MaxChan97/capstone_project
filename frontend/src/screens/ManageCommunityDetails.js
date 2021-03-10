/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import defaultDP from "../assets/Default Dp logo.svg";
import defaultBanner from "../assets/Profile Banner Image.png";
import Select from "react-select";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import { storage } from "../firebase";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
var uuid = require("uuid");

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const topics = [
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "FUTURES", label: "Futures" },
  { value: "CRYPTOCURRENCY", label: "Cryptocurrency" },
  { value: "STOCKS", label: "Stocks" },
];

export default function ManageCommunityDetails() {
  const classes = useStyles();
  const alert = useAlert();
  const { communityId } = useParams();

  const [currentCommunity, setCurrentCommunity] = useState({});
  const [refresh, setRefresh] = useState(true);

  const [communityName, setCommunityName] = useState("");
  const handleCommunityNameChange = (event) => {
    setCommunityName(event.target.value);
  };

  const [communityDescription, setDescription] = useState("");
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const [topicInterests, setTopicInterests] = useState([]);
  const handleTopicInterestsChange = (selectedOptions) => {
    let tempSelectedOptions = [];
    for (var i = 0; i < selectedOptions.length; i++) {
      tempSelectedOptions.push(selectedOptions[i].value);
    }
    setTopicInterests(tempSelectedOptions);
  };

  const history = useHistory();

  const handleDelete = () => {
    openDeleteCommunityModal();
  };
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = React.useState(
    false
  );

  function openDeleteCommunityModal() {
    setConfirmDeleteDialogOpen(true);
  }

  function closeDeleteCommunityModal() {
    setConfirmDeleteDialogOpen(false);
  }

  const [communityPicture, setCommunityPicture] = useState("");
  const [communityBanner, setCommunityBanner] = useState("");

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
            setCommunityPicture(url);
          });
      }
    );
  };

  const changeCommunityBannerHandler = (event) => {
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
            setCommunityBanner(url);
          });
      }
    );
  };

  const [currentPerson, setCurrentPerson] = useState({});

  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      loadData(communityId);
    }
  }, [communityId, refresh]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function loadData(communityId) {
    Api.getCommunityById(communityId, currentUser)
      .done((currentCommunity) => {
        console.log(currentCommunity);
        setCurrentCommunity(currentCommunity);
        setCommunityName(currentCommunity.name);
        setDescription(currentCommunity.description);
        setTopicInterests(currentCommunity.topicEnums);
        setCommunityPicture(currentCommunity.communityProfilePicture);
        setCommunityBanner(currentCommunity.communityBanner);
      })
      .fail((xhr, status, error) => {
        alert.show("This community does not exist!");
      });
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

  function MakeOption(x) {
    return { value: x, label: toTitleCase(x) };
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

  function handleSubmit(e) {
    e.preventDefault();

    Api.editCommunityDetails(
      communityId,
      communityDescription,
      topicInterests,
      communityPicture,
      communityBanner
    )
      .done(() => {
        console.log(communityBanner);
        alert.show("Community Updated Successfully!");
        setRefresh(!refresh);
        history.push("/community/" + communityId);
      })
      .fail((xhr, status, error) => {
        console.log(xhr.responseJSON.error);
        if (xhr.responseJSON.error === "Missing Community parameter") {
          setCommunityName("");
          alert.show("Please include the community id");
        }
        if (xhr.responseJSON.error === "Missing community name") {
          setCommunityName("");
          alert.show("Please fill in the community name");
        }
      });
  }

  function handleDeleteCommunity() {
    if (currentCommunity.owner.id === currentUser) {
      Api.deleteCommunity(communityId, currentUser)
        .done(() => {
          alert.show("Delete success!");
          setRefresh(!refresh);
          closeDeleteCommunityModal();
          history.push("/community");
        })
        .fail((xhr, status, error) => {
          console.log(xhr.responseJSON.error);
          if (xhr.responseJSON.error === "Missing Community parameter") {
            setCommunityName("");
            alert.show("Please include the community id");
          }
        });
    } else {
      alert.show("Invalid Request by non-owner!");
    }
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-9 ml-4 mt-4" style={{ textAlign: "left" }}>
          <div className="card card-primary">
            <div className="card-body">
              <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                Community Picture
              </Box>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <div className="container">
                  <div className="row">
                    <div className="col-sm-3">
                      <img
                        style={{
                          resizeMode: "repeat",
                          height: 130,
                          width: 130,
                          borderRadius: "50%",
                          display: "block",
                        }}
                        src={communityPicture || defaultDP}
                      />
                    </div>
                    <div className="col-sm-8">
                      <label
                        for="pp"
                        className="btn"
                        style={{
                          height: "35px",
                          width: "100px",
                          outline: "none",
                          fontWeight: "600",
                          "background-color": "#3B21CB",
                          color: "white",
                        }}
                      >
                        <p>UPLOAD</p>
                        <input
                          id="pp"
                          type="file"
                          name="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={changeCommunityPictureHandler}
                        />
                      </label>
                      <Box fontWeight="fontWeightRegular" m={1}>
                        JPEG or PNG only and cannot exceed 10MB. It’s
                        recommended to use a picture that’s at least 100 x 100
                        pixels
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
              <br></br>

              <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                Community Banner
              </Box>
              <img
                style={{
                  resizeMode: "repeat",
                  height: 80,
                  width: 512,
                }}
                src={communityBanner || defaultBanner}
              />
              <Box fontWeight="fontWeightRegular" m={1}>
                File format: JPEG or PNG (recommended 1024 x 160 , max 10MB)
              </Box>
              <label
                for="pb"
                className="btn"
                style={{
                  height: "35px",
                  width: "100px",
                  outline: "none",
                  fontWeight: "600",
                  "background-color": "#3B21CB",
                  color: "white",
                }}
              >
                <p>UPLOAD</p>
                <input
                  id="pb"
                  type="file"
                  name="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={changeCommunityBannerHandler}
                />
              </label>
              <br></br>
              <br></br>

              <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                Community Details
              </Box>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="inputCommunityName">Community Name</label>
                    <p>{communityName}</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputDescription">Description</label>
                    <textarea
                      className="form-control"
                      value={communityDescription}
                      maxLength={1000}
                      onChange={handleDescriptionChange}
                    />
                    {communityDescription !== undefined ? (
                      <p style={{ textAlign: "right" }}>
                        {communityDescription.length}/1000
                      </p>
                    ) : (
                      <p style={{ textAlign: "right" }}>0/1000</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputInterests">Related Topics</label>
                    {topicInterests !== undefined ? (
                      <Select
                        value={topicInterests.map((x) => MakeOption(x))}
                        isMulti
                        name="topics"
                        options={topics}
                        onChange={(selectedOptions) =>
                          handleTopicInterestsChange(selectedOptions)
                        }
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    ) : (
                      <Select
                        isMulti
                        name="topics"
                        options={topics}
                        onChange={(selectedOptions) =>
                          handleTopicInterestsChange(selectedOptions)
                        }
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <ColorButton
                      style={{
                        height: "35px",
                        width: "100px",
                        outline: "none",
                        float: "right",
                        fontWeight: "600",
                      }}
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Save
                    </ColorButton>
                  </div>
                </div>
              </form>
              <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                Delete Community
              </Box>
              <Box fontWeight="fontWeightRegular" m={1}>
                Deleting this community will delete all the posts, members and
                details of the group.
              </Box>
              <Box fontWeight="fontWeightRegular" m={1}>
                This action cannot be undone.
              </Box>
              <ColorButton
                style={{
                  height: "35px",
                  width: "100px",
                  outline: "none",
                  float: "left",
                  fontWeight: "600",
                  marginTop: "20px",
                  marginLeft: "10px",
                  marginBottom: "20px",
                }}
                variant="contained"
                color="primary"
                onClick={handleDelete}
              >
                Delete
              </ColorButton>
              <Dialog
                open={confirmDeleteDialogOpen}
                onClose={closeDeleteCommunityModal}
                aria-labelledby="confirm-delete-dialog-title"
                aria-describedby="confirm-delete-dialog-description"
              >
                <DialogTitle id="confirm-delete-dialog-title">
                  Delete {communityName}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="confirm-delete-dialog-description">
                    Are you sure you want to delete {communityName}?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    style={{ outline: "none" }}
                    onClick={closeDeleteCommunityModal}
                  >
                    Cancel
                  </Button>
                  <ColorButton
                    style={{ outline: "none" }}
                    onClick={handleDeleteCommunity}
                    color="primary"
                    variant="contained"
                    autoFocus
                  >
                    Delete
                  </ColorButton>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
