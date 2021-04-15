import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Select from "react-select";
import Api from "../../../helpers/Api";
import { useAlert } from "react-alert";
import { storage } from "../../../firebase";
import CircularProgressWithLabel from "../../CircularProgressWithLabel";
import { useHistory } from "react-router-dom";
import moment from "moment";
import * as dayjs from "dayjs";
import { Link } from "react-router-dom";
import defaultDP from "../../../assets/Default Dp logo.svg";
import {
  Dialog,
  DialogActions,
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

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

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

export default function ProfileManagementButtonGroup({ refresh, setRefresh }) {
  const classes = useStyles();
  let history = useHistory();
  const alert = useAlert();

  const [currentPerson, setCurrentPerson] = useState({});
  const [editDialog, setShowEditDialog] = useState(false);

  const [profilePicture, setProfilePicture] = useState("");
  const [profileBanner, setProfileBanner] = useState("");
  const [profileProgress, setProfileProgress] = useState(0);
  const [bannerProgress, setBannerProgress] = useState(0);
  const [editedBanner, setEditedBanner] = useState(false);
  const [tempBanner, setTempBanner] = useState("");

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

  const currentUser = useSelector((state) => state.currentUser);
  const isAdmin = useSelector((state) => state.isAdmin);

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
        if (currentPerson.dob !== undefined) {
          setDoB(dayjs(currentPerson.dob.slice(0, -5)).toDate());
        }
        if (currentPerson.incomeRange !== undefined) {
          setIncomeRange(stringToIncomes(currentPerson.incomeRange));
        }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    let incomeRangeStr;
    if (incomeRange == undefined) {
      incomeRangeStr = "";
    } else {
      incomeRangeStr = incomeRange.value;
    }

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
        alert.show("Update successful");
        setRefresh(!refresh);
        setShowEditDialog(false);
        setEditedBanner(false);
      })
      .fail((xhr, status, error) => {
        //alert.show("Something went wrong, please try again!");
        alert.show(xhr.responseJSON.error);
      });
  };

  /*const changeProfilePictureHandler = (event) => {
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

  const changeProfileBannerHandler2 = (event) => {
    console.log("change");
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
            setEditedBanner(true);
          });
      }
    );
  };*/

  function handleCustomiseDialogOpen() {
    setShowEditDialog(true);
  }

  function handleCustomiseDialogClose() {
    setShowEditDialog(false);
    setEditedBanner(false);
  }

  function renderCustomiseProfileDialog() {
    return (
      <Dialog open={editDialog} onClose={handleCustomiseDialogClose}>
        <DialogTitle
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: "0px",
          }}
        >
          <b>Customise Profile</b>
        </DialogTitle>
        <DialogActions>
          <div
            className="card-body"
            style={{ width: "30vw", paddingTop: "0px" }}
          >
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="ml-2 mr-4">
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
                    maxLength={250}
                    onChange={(e) => {
                      setAbout(e.target.value);
                    }}
                  />
                  {description !== undefined ? (
                    <p style={{ textAlign: "right" }}>
                      {description.length}/250
                    </p>
                  ) : (
                    <p style={{ textAlign: "right" }}>0/250</p>
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
                    onClick={handleCustomiseDialogClose}
                  >
                    Save
                  </ColorButton>
                </div>
              </div>
            </form>
          </div>
        </DialogActions>
      </Dialog>
    );
  }
  return isAdmin == false ? (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "35%",
      }}
    >
      <ColorButton
        style={{
          height: "40px",
          width: "160px",
          outline: "none",
          marginRight: "3%",
        }}
        variant="contained"
        color="primary"
        onClick={handleCustomiseDialogOpen}
      >
        Customise
      </ColorButton>

      <Button
        style={{ height: "40px", width: "160px", outline: "none" }}
        variant="outlined"
        color="primary"
      >
        <Link
          style={{ color: "inherit", textDecoration: "none" }}
          to="/userSettings"
        >
          Manage
        </Link>
      </Button>
      {renderCustomiseProfileDialog()}
    </div>
  ) : (
    ""
  );
}
