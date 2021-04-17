import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import defaultDP from "../../assets/Default Dp logo.svg";
import defaultBanner from "../../assets/Profile Banner Image.png";
import Select from "react-select";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";
import { storage } from "../../firebase";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel.js";
import { useHistory } from "react-router-dom";
import moment from "moment";
import * as dayjs from "dayjs";
import TextField from "@material-ui/core/TextField";

var uuid = require("uuid");

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const topics = [
  { value: "INVESTMENTS", label: "Investments" },
  { value: "STOCKS", label: "Stocks" },
  { value: "SAVINGS", label: "Savings" },
  { value: "CAREER", label: "Career" },
  { value: "ETF", label: "ETF" },
  { value: "ROBOADVISORS", label: "Robo-Advisors" },
  { value: "TRADING", label: "Trading" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "BROKERAGES", label: "Brokerages" },
  { value: "RETIREMENT", label: "Retirement" },
  { value: "SALARY", label: "Salary" },
  { value: "CPF", label: "CPF" },
  { value: "BTO", label: "BTO" },
  { value: "UTILITIES_BILL", label: "Utilities Bill" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "FUTURES", label: "Futures" },
  { value: "CRYPTOCURRENCY", label: "Cryptocurrency" },
  { value: "CREDITCARDS", label: "Credit Cards" },
  { value: "BANKING", label: "Banking" },
  { value: "REITS", label: "REITs" },
  { value: "BLOCKCHAIN", label: "Blockchain" },
];

const incomes = [
  { value: "NOT_EARNING", label: "No income" },
  { value: "LOW", label: "0-25K" },
  { value: "MIDDLE_LOW", label: "25-45K" },
  { value: "MIDDLE", label: "45-90K" },
  { value: "MIDDLE_HIGH", label: "90-150K" },
  { value: "HIGH", label: "150-200K" },
  { value: "CRA", label: "200K and above" },
];

export default function CustomiseProfile() {
  let history = useHistory();
  const classes = useStyles();
  const alert = useAlert();

  const [title, setTitle] = useState("");
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const [link, setLink] = useState("");
  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  const [topicInterests, setTopicInterests] = useState();
  const handleTopicInterestsChange = (selectedOptions) => {
    let tempSelectedOptions = [];
    for (var i = 0; i < selectedOptions.length; i++) {
      tempSelectedOptions.push(selectedOptions[i].value);
    }
    setTopicInterests(tempSelectedOptions);
  };

  const [description, setDescription] = useState();

  const [profileBanner, setProfileBanner] = useState("");
  const [bannerProgress, setBannerProgress] = useState(0);

  const changeProfileBannerHandler = (event) => {
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
        setBannerProgress(progress);
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
            setProfileBanner(url);
          });
      }
    );
  };

  const [refresh, setRefresh] = useState(true);

  const currentUser = useSelector((state) => state.currentUser);


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

  const handleSubmit = (e) => {
    e.preventDefault();
    Api.createAdvertisement(
        title,
        description,
        link,
        profileBanner,
        topicInterests,
      )
        .done(() => {
          alert.show("Advertisement added successfully!");
          history.push("/admin/advertisementmanagement");
          // setRefresh(!refresh);
        })
        .fail((xhr, status, error) => {
          //alert.show("Something went wrong, please try again!");
          //alert.show(xhr.responseJSON.error);
        });
  };


  return (
    <div style={{ overflowX: "hidden",}} className="content-wrapper">
      <div className="row">
        <div className="col-md-10 mt-4" style={{ textAlign: "left", margin:"auto" }}>
          <div className="card card-primary">
            <div className="card-body">

              <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                Advertisement Banner
              </Box>
              {bannerProgress > 0 && bannerProgress < 100 ? (
                <div className="d-flex justify-content-center">
                  <CircularProgressWithLabel value={bannerProgress} size={80} />
                </div>
              ) : (
                <img
                  style={{
                    resizeMode: "repeat",
                    height: "120px",
                    width: "750px",
                  }}
                  src={profileBanner || defaultBanner}
                />
              )}
              <Box fontWeight="fontWeightRegular" m={1}>
                File format: JPEG or PNG (recommended 750 x 120px , max 10MB)
              </Box>
              <label
                for="pb"
                className="btn"
                style={{
                  height: "40px",
                  width: "250px",
                  outline: "none",
                  fontWeight: "600",
                  backgroundColor: "#3B21CB",
                  color: "white",
                }}
              >
                <p>ADD ADVERTISEMENT</p>
                <input
                  id="pb"
                  type="file"
                  name="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={changeProfileBannerHandler}
                />
              </label>
              <br></br>
              <br></br>

              <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                Advertisement Details
              </Box>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="inputTitle">Title</label>
                    <input
                      type="text"
                      id="inputTitle"
                      className="form-control"
                      value={title}
                      required="required"
                      oninvalid="this.setCustomValidity('Please enter title');"
                      oninput="setCustomValidity('')"
                      onChange={handleTitleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="inputAbout">Description</label>
                    <textarea
                      className="form-control"
                      value={description}
                      maxLength={255}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                    {description !== undefined ? (
                      <p style={{ textAlign: "right" }}>
                        {description.length}/255
                      </p>
                    ) : (
                      <p style={{ textAlign: "right" }}>0/255</p>
                    )}
                  </div>


                  <div className="form-group">
                    <label htmlFor="inputInterests">Interests</label>
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
                    <label htmlFor="inputLink">Website link</label>
                    <input
                      type="text"
                      id="inputLink"
                      className="form-control"
                      value={link}
                      required="required"
                      oninvalid="this.setCustomValidity('Please enter link');"
                      oninput="setCustomValidity('')"
                      onChange={handleLinkChange}
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
                      Create
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
