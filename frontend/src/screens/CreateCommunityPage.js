/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import defaultDP from "../assets/Default Dp logo.svg";
import defaultBanner from "../assets/Profile Banner Image.png";
import Select from "react-select";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import { storage } from "../firebase";
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

export default function CreateCommunity() {
  const classes = useStyles();
  const alert = useAlert();

  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [topicInterests, setTopicInterests] = useState([]);
  const [communityPicture, setCommunityPicture] = useState("");
  const [communityBanner, setCommunityBanner] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();
  

  const handleTopicInterestsChange = (selectedOptions) => {
    let tempSelectedOptions = [];
    for (var i = 0; i < selectedOptions.length; i++) {
      tempSelectedOptions.push(selectedOptions[i].value);
    }
    setTopicInterests(tempSelectedOptions);
  };

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
  const [refresh, setRefresh] = useState(true);

  const currentUser = useSelector((state) => state.currentUser);


  if (currentUser === null) {
    return <Redirect to="/login" />;
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

  function handleRegister(e) {
    e.preventDefault();
    console.log("test1");
    Api.createCommunity(
        currentUser, 
        communityName, 
        description, 
        topicInterests, 
        communityPicture, 
        communityBanner)
      .done((createdCommunity) => {
        alert.show("Community Created Successfully!");
        setCommunityName("");
        setDescription("");
        setTopicInterests("");
        setCommunityPicture("");
        setCommunityBanner("");
        history.push("/community/" + createdCommunity.id);
      })
      .fail((xhr, status, error) => {
        console.log(xhr.responseJSON.error);
        if (xhr.responseJSON.error === "Community Name taken") {
          setCommunityName("");
          alert.show("This community name is already in use");
        }
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
                          display: "block"
                        }}
                        src={communityPicture || defaultDP}
                        alt="Community Picture"
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
                        JPEG or PNG only and cannot exceed 10MB. It’s recommended
                        to use a picture that’s at least 100 x 100 pixels
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
              <form onSubmit={(e) => handleRegister(e)}>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="inputCommunityName">Community Name</label>
                    <input
                      type="text"
                      id="inputCommunityName"
                      // required
                      className="form-control"
                      value={communityName}
                      onChange={(e) => {
                        setCommunityName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputDescription">Description</label>
                    <input
                      type="text"
                      id="inputDescription"
                      // required
                      className="form-control"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputTopics">Related Topics</label>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
