import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import LeaderboardCard from "../components/FeedPage/LeaderboardCard";
import LiveHorizontalMenu from "../components/FeedPage/LiveHorizontalMenu";
import CreatePostCard from "../components/CommunityPage/CreatePostCard";
import ProfilePostCard from "../components/CommunityPage/ProfilePostCard";
import PostList from "../components/CommunityPage/PostList";
import PostListOfFollowing from "../components/FeedPage/PostListOfFollowing";
import TrendsCard from "../components/FeedPage/TrendsCard";

import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import Modal from "react-bootstrap/Modal";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Select from "react-select";
import moment from "moment";
import {
  InputBase,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    justifyContent: 'center',
    alignItems: 'center',
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

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
  customModalStyle: {
    minWidth: 400,
    minHeight: 600,
  },
}));

export default function FeedPage() {
  const alert = useAlert();
  const horizontalList = [
    {
      name: "Carl",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/7.png?alt=media&token=947053da-100e-45e8-9d04-4cb3308a6752",
    },
    {
      name: "Max",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/4.jpg?alt=media&token=69f3a6ad-2760-44a1-8cef-71cc5afa83de",
    },
    {
      name: "Shawn",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/6.png?alt=media&token=eb821955-61df-4541-a24b-fc5fdcf73fc1",
    },
    {
      name: "Megan",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/5.jpg?alt=media&token=83ca539e-7ecc-49aa-b963-f01534f015fe",
    },
    {
      name: "Xin Yi",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/3.png?alt=media&token=2f08d223-83f6-4ca4-92be-f520d2fdbe3b",
    },
    {
      name: "Sing Jie",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/2.jpg?alt=media&token=ae0cd3a5-2a21-4175-b486-d312ef9b3f9b",
    },
    {
      name: "LHH",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/1.jpeg?alt=media&token=b7a7f029-7934-42cc-8117-4ed9434c9e63",
    },
    {
      name: "TWK",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/7.png?alt=media&token=947053da-100e-45e8-9d04-4cb3308a6752",
    },
    {
      name: "LHL",
      viewers: "20000",
      category: "Stocks",
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/7.png?alt=media&token=947053da-100e-45e8-9d04-4cb3308a6752",
    },
  ];

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

  const classes = useStyles();

  const [DoB, setDoB] = useState();
  const handleDoBChange = (event) => {
    setDoB(event.target.value);
  };

  const [incomeRange, setIncomeRange] = useState();
  const handleIncomeRangeChange = (event) => {
    setIncomeRange(event.target.value);
    console.log(event.target.value);
  };

  const [topicInterests, setTopicInterests] = useState();
  const handleTopicInterestsChange = (selectedOptions) => {
    let tempSelectedOptions = [];
    for (var i = 0; i < selectedOptions.length; i++) {
      tempSelectedOptions.push(selectedOptions[i].value);
    }
    setTopicInterests(tempSelectedOptions);
  };

  const [topTenContributors, setTopTenContributors] = useState([]);
  const [topTrends, setTopTrends] = useState([]);
  const [todaysTrends, setTodaysTrends] = useState([]);
  const [horizontalMenu, setHorizontalMenu] = useState(horizontalList);

  const currentUser = useSelector((state) => state.currentUser);
  const [OnboardingDialogueOpen, setOnboardingDialogueOpen] = useState(false);

  // Modal
  useEffect(() => { }, [horizontalMenu]);
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let incomeRangeStr;
    let topicInterestsArr;
    if (incomeRange == undefined) {
      incomeRangeStr = "NOT_EARNING";
    } else {
      incomeRangeStr = incomeRange.value;
    }
    if (topicInterests == undefined) {
      topicInterestsArr = [];
    } else {
      topicInterestsArr = topicInterests;
    }
    console.log("YESYESYES");
    console.log(topicInterests);
    Api.updateCompletedOnboarding(
      currentUser,
      topicInterestsArr,
      moment(DoB).format("DD/MM/yyyy"),
      incomeRangeStr
    )
      .done(() => {
        setOnboardingDialogueOpen(false);
        alert.show("Onboarding completed!");
        //history.push("/profile/" + currentUser);
        //setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        //alert.show("Something went wrong, please try again!");
        alert.show(xhr.responseJSON.error);
      });
  };

  function loadData() {
    Api.getTopTenContributors()
      .done((topTenContributors) => {
        setTopTenContributors(topTenContributors);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
    Api.getTopTrends()
      .done((topAllTime) => {
        setTopTrends(topAllTime);
      })
      .fail((xhr, status, error) => {
        alert("Error");
      });
    Api.getTodaysTrends()
      .done((topToday) => {
        console.log(topToday);
        setTodaysTrends(topToday);
      })
      .fail((xhr, status, error) => {
        alert("Error");
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

  //const handleOnboardingDialogueClose = () => setOnboardingDialogueOpen(false);
  const handleOnboardingDialogueOpen = () => setOnboardingDialogueOpen(true);

  // function handleOnboardingDialogueSkip() {
  //   console.log("skip");
  //   Api.updateSkipOnboarding(currentUser)
  //     .done(() => {
  //       console.log("Skipped");
  //       setOnboardingDialogueOpen(false);
  //     })
  //     .fail((xhr, status, error) => {
  //       alert.show("Error skipping onboarding");
  //     });
  // }

  function initiateOnboardingDialogue(e) {
    // Check if new user
    Api.getPersonById(currentUser).done((currentPerson) => {
      //e.preventDefault();
      if (!currentPerson.completedOnboarding) {
        handleOnboardingDialogueOpen();
      }
    });
  }

  function renderOnboardingDialogue() {
    return (
      <Dialog
        contentClassName="customerModalStyle"
        open={OnboardingDialogueOpen}
        onHide={handleSubmit}
        backdrop="static"
        keyboard={false}
        size="sm"
        aria-labelledby="onboarding-dialog-title"
        aria-describedby="onboarding-dialog-description"
      >
        <DialogTitle id="onboarding-dialog-title">
          Welcome to Bull & Bear!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-start-stream-dialog-description">
            Let's get to know each other. Sharing a little info will help us
            customize better content for you.
          </DialogContentText>
          <form>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="inputDoB">Birthday</label>
                <form className={classes.container} noValidate>
                  <input
                    id="DoB"
                    // label="Birthday"
                    type="date"
                    required
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
                    required
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
                <label htmlFor="inputInterests">Interests</label>
                {topicInterests !== undefined ? (
                  <Select
                    value={topicInterests.map((x) => MakeOption(x))}
                    isMulti
                    required
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
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          {/* <Button
            style={{ outline: "none" }}
            onClick={handleOnboardingDialogueSkip}
          >
            Skip
          </Button> */}
          <ColorButton
            style={{ outline: "none" }}
            color="primary"
            variant="contained"
            type="submit"
            centered
            onClick={handleSubmit}
          >
            Confirm
          </ColorButton>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="container">
        {initiateOnboardingDialogue()}
        <div className="row">
          <div className="col-md-12">
            <LiveHorizontalMenu data={horizontalMenu}></LiveHorizontalMenu>
          </div>
        </div>
        <div className="row">
          <div className="col-md-9 mt-4">
            <PostListOfFollowing></PostListOfFollowing>
          </div>

          <div className="col-md-3 mt-4" style={{ textAlign: "left" }}>
            <div className="row">
              <LeaderboardCard data={topTenContributors} />
            </div>
            <div className="row">
              <TrendsCard topTrends={topTrends} todaysTrends={todaysTrends} />
            </div>
          </div>
        </div>
      </div>
      {renderOnboardingDialogue()}
    </div>
  );
}
