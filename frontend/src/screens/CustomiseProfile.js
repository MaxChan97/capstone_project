import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
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
import CircularProgressWithLabel from "../components/CircularProgressWithLabel.js";
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
  { value: "INVESTMENTS,", label: "Investments" },
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

  const [username, setUsername] = useState();
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const [DoB, setDoB] = useState();
  const handleDoBChange = (event) => {
    setDoB(event.target.value);
  };

  const [incomeRange, setIncomeRange] = useState();
  const handleIncomeRangeChange = (event) => {
    setIncomeRange(event.target.value);
    console.log(event.target.value);
  };

  const [description, setAbout] = useState();
  const handleAboutChange = (event) => {
    setAbout(event.target.value);
  };

  const [topicInterests, setTopicInterests] = useState();
  const handleTopicInterestsChange = (selectedOptions) => {
    let tempSelectedOptions = [];
    for (var i = 0; i < selectedOptions.length; i++) {
      tempSelectedOptions.push(selectedOptions[i].value);
    }
    setTopicInterests(tempSelectedOptions);
  };

  const [profilePicture, setProfilePicture] = useState("");
  const [profileBanner, setProfileBanner] = useState("");
  const [profileProgress, setProfileProgress] = useState(0);
  const [bannerProgress, setBannerProgress] = useState(0);

  const changeProfilePictureHandler = (event) => {
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
        setProfileProgress(progress);
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
            setProfilePicture(url);
          });
      }
    );
  };

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

  const [currentPerson, setCurrentPerson] = useState({});
  const [refresh, setRefresh] = useState(true);

  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser);
    }
  }, [currentUser, refresh]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function stringToIncomes(incomeRangeStr) {
    for (var i = 0; i < incomes.length; i++) {
      if (incomes[i].value === incomeRangeStr) {
        return incomes[i];
      }
    }
  }

  function loadData(currentUser) {
    Api.getPersonById(currentUser)
      .done((currentPerson) => {
        console.log(currentPerson);
        setCurrentPerson(currentPerson);
        setUsername(currentPerson.username);
        setAbout(currentPerson.description);
        if (currentPerson.dob != undefined) {
          setDoB(dayjs(currentPerson.dob.slice(0, -5)).toDate());
        }
        if (currentPerson.incomeRange != undefined) {
          setIncomeRange(stringToIncomes(currentPerson.incomeRange));
        }
        console.log(currentPerson.incomeRange);
        setTopicInterests(currentPerson.topicInterests);
        setProfilePicture(currentPerson.profilePicture);
        setProfileBanner(currentPerson.profileBanner);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
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

  function getInitialState() {
    var value = new Date().toISOString();
    return {
      value: value,
    };
  }

  function handleChange(value, formattedValue) {
    this.setState({
      value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValue: formattedValue, // Formatted String, ex: "11/19/2016"
    });
  }

  function componentDidUpdate() {
    // Access ISO String and formatted values from the DOM.
    var hiddenInputElement = document.getElementById("example-datepicker");
    console.log(hiddenInputElement.value); // ISO String, ex: "2016-11-19T12:00:00.000Z"
    console.log(hiddenInputElement.getAttribute("data-formattedvalue")); // Formatted String, ex: "11/19/2016"
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
    console.log(typeof incomeRange.value);
    const incomeRangeStr = incomeRange.value;
    console.log(typeof moment(DoB).format("dd/MM/yyyy"));
    console.log(incomeRange);
    Api.editPersonProfileInformation(
      currentUser,
      username,
      moment(DoB).format("DD/MM/yyyy"),
      incomeRangeStr,
      description,
      topicInterests,
      profilePicture,
      profileBanner
    )
      .done(() => {
        alert.show("Profile updated successfully!");
        history.push("/profile/" + currentUser);
        // setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        //alert.show("Something went wrong, please try again!");
        alert.show(xhr.responseJSON.error);
      });
  };

  function getIncomeRangeToDisplay(incomeRange) {
    for (var i = 0; i < incomes.length; i++) {
      if (incomes[i].value === incomeRange) {
        return incomes[i];
      }
    }
  }

  return (
    <div style={{ overflowX: "hidden" }} className="content-wrapper">
      <div className="row">
        <div className="col-md-9 mt-4 ml-4" style={{ textAlign: "left" }}>
          <div className="card card-primary">
            <div className="card-body">
              <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                Profile Picture
              </Box>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <div className="container">
                  <div className="row">
                    <div className="col-sm-3">
                      {profileProgress > 0 && profileProgress < 100 ? (
                        <div className="d-flex justify-content-center">
                          <CircularProgressWithLabel
                            value={profileProgress}
                            size={130}
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
                          }}
                          src={profilePicture || defaultDP}
                        />
                      )}
                    </div>
                    <div className="col-sm-8">
                      <label
                        for="pp"
                        className="btn"
                        style={{
                          height: "35px",
                          width: "220px",
                          outline: "none",
                          fontWeight: "600",
                          backgroundColor: "#3B21CB",
                          color: "white",
                        }}
                      >
                        <p>ADD PROFILE PICTURE</p>
                        <input
                          id="pp"
                          type="file"
                          name="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={changeProfilePictureHandler}
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
                Profile Banner
              </Box>
              {bannerProgress > 0 && bannerProgress < 100 ? (
                <div className="d-flex justify-content-center">
                  <CircularProgressWithLabel value={bannerProgress} size={80} />
                </div>
              ) : (
                <img
                  style={{
                    resizeMode: "repeat",
                    height: 80,
                    width: 512,
                  }}
                  src={profileBanner || defaultBanner}
                />
              )}
              <Box fontWeight="fontWeightRegular" m={1}>
                File format: JPEG or PNG (recommended 1024 x 160 , max 10MB)
              </Box>
              <label
                for="pb"
                className="btn"
                style={{
                  height: "35px",
                  width: "220px",
                  outline: "none",
                  fontWeight: "600",
                  backgroundColor: "#3B21CB",
                  color: "white",
                }}
              >
                <p>ADD PROFILE BANNER</p>
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
                Profile Details
              </Box>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="inputUsername">Username</label>
                    <input
                      type="text"
                      id="inputUsername"
                      // required
                      className="form-control"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputDoB">Birthday</label>
                    <form className={classes.container} noValidate>
                      <input
                        id="DoB"
                        // label="Birthday"
                        type="date"
                        defaultValue="2021-01-01"
                        className="form-control"
                        value={moment(DoB).format("YYYY-MM-DD")}
                        onChange={handleDoBChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </form>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputIncomeRange">Annual Income</label>
                    {incomeRange !== undefined ? (
                      <Select
                        name="incomes"
                        options={incomes}
                        value={incomeRange}
                        onChange={setIncomeRange}
                        classNamePrefix="select"
                      />
                    ) : (
                      <Select
                        name="incomes"
                        options={incomes}
                        onChange={setIncomeRange}
                        classNamePrefix="select"
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputAbout">About</label>
                    <textarea
                      className="form-control"
                      value={description}
                      maxLength={255}
                      onChange={(e) => {
                        setAbout(e.target.value);
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
