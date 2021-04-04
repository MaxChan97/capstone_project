import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import TabPanel from "../components/UserAnalyticsPage/TabPanel";
import StatisticsCard from "../components/UserAnalyticsPage/StatisticsCard";
import AnalyticsBackground from "../assets/analyticsBackground.jpg";
import Api from "../helpers/Api";

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 2,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    width: "100%",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function UserAnalytics() {
  const classes = useStyles();
  const currentUser = useSelector((state) => state.currentUser);
  const [value, setValue] = useState(0);

  const [username, setUsername] = useState();

  const [prevActiveSubscribers, setPrevActiveSubscribers] = useState();
  const [activeSubscribers, setActiveSubscribers] = useState();
  const [subscribersArray, setSubscribersArray] = useState();

  const [prevActiveFollowers, setPrevActiveFollowers] = useState();
  const [activeFollowers, setActiveFollowers] = useState();
  const [followersArray, setFollowersArray] = useState();

  const [prevViews, setPrevViews] = useState();
  const [views, setViews] = useState();
  const [viewsArray, setViewsArray] = useState();

  const [prevEarnings, setPrevEarnings] = useState();
  const [earnings, setEarnings] = useState();
  const [earningsArray, setEarningsArray] = useState();

  const [interestsDemographics, setInterestsDemographics] = useState();

  useEffect(() => {
    Api.getFollowers(currentUser)
      .done((followers) => {
        let interestsDemographics = [];
        let noOfInterests = 0;
        for (const prop in followers) {
          for (const ti of followers[prop]["follower"]["topicInterests"]) {
            let found = false;
            for (const interest of interestsDemographics) {
              if (ti.replace("_", " ") == interest["name"]) {
                interest["y"] += 1;
                found = true;
                break;
              }
            }
            if (!found) {
              let newInterest = {};
              newInterest["name"] = ti.replace("_", " ");
              newInterest["y"] = 1;
              interestsDemographics.push(newInterest);
            }
          }
        }
        setInterestsDemographics(interestsDemographics);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getPersonById(currentUser)
      .done((person) => {
        setUsername(person.username);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getSubscribersAnalytics(currentUser)
      .done((subscribersAnalytics) => {
        let subscribersArray = Object.entries(subscribersAnalytics);
        let latestTime = 0;
        let prevActiveSubscribers = 0;
        let activeSubscribers = 0;
        subscribersArray.forEach((element) => {
          element[0] = parseInt(element[0], 10);
          if (element[0] > latestTime) {
            latestTime = element[0];
            prevActiveSubscribers = activeSubscribers;
            activeSubscribers = element[1];
          }
        });
        setPrevActiveSubscribers(prevActiveSubscribers);
        setActiveSubscribers(activeSubscribers);
        setSubscribersArray(subscribersArray);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getFollowersAnalytics(currentUser)
      .done((followersAnalytics) => {
        let followersArray = Object.entries(followersAnalytics);
        let latestTime = 0;
        let prevActiveFollowers = 0;
        let activeFollowers = 0;
        followersArray.forEach((element) => {
          element[0] = parseInt(element[0], 10);
          if (element[0] > latestTime) {
            latestTime = element[0];
            prevActiveFollowers = activeFollowers;
            activeFollowers = element[1];
          }
        });

        setPrevActiveFollowers(prevActiveFollowers);
        setActiveFollowers(activeFollowers);
        setFollowersArray(followersArray);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getViewersAnalytics(currentUser)
      .done((viewersAnalytics) => {
        let viewsArray = Object.entries(viewersAnalytics);
        let latestTime = 0;
        let prevViews = 0;
        let views = 0;
        viewsArray.forEach((element) => {
          element[0] = parseInt(element[0], 10);
          if (element[0] > latestTime) {
            latestTime = element[0];
            prevViews = views;
            views = element[1];
          }
        });
        setPrevViews(prevViews);
        setViews(views);
        setViewsArray(viewsArray);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getEarningsAnalytics(currentUser)
      .done((earningsAnalytics) => {
        let earningsArray = Object.entries(earningsAnalytics);
        let latestTime = 0;
        let prevEarnings = 0;
        let earnings = 0;
        earningsArray.forEach((element) => {
          element[0] = parseInt(element[0], 10);
          if (element[0] > latestTime) {
            latestTime = element[0];
            prevEarnings = earnings;
            earnings = element[1];
          }
        });
        setPrevEarnings(prevEarnings);
        setEarnings(earnings);
        setEarningsArray(earningsArray);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, []);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const parseOptions = (title, yAxisTitle, seriesData) => {
    return {
      title: {
        text: title,
      },
      time: {
        useUTC: false,
      },
      yAxis: {
        title: {
          text: yAxisTitle,
        },
      },
      series: seriesData,
      xAxis: {
        type: "datetime",
      },
      legend: {
        enabled: false,
      },
    };
  };

  const subscribersOptions = parseOptions("Subscribers", "No. of Subscribers", [
    {
      name: "Subscribers",
      data: subscribersArray,
    },
  ]);

  const followersOptions = parseOptions("Followers", "No. of Followers", [
    {
      name: "Followers",
      data: followersArray,
    },
  ]);

  const viewsOptions = parseOptions("Views", "No. of views", [
    {
      name: "Views",
      data: viewsArray,
    },
  ]);

  const earningsOptions = parseOptions("Earnings", "Total earnings", [
    {
      name: "Earnings",
      data: earningsArray,
    },
  ]);

  const createOptionsPie = (seriesData) => {
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        text: "Your Followers' Interests",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
        },
      },
      series: [
        {
          name: "Percent",
          colorByPoint: true,
          data: seriesData,
        },
      ],
    };
  };

  const optionsPie = createOptionsPie(interestsDemographics);
  //sliced = true;
  //selected = true;

  return (
    <div className="content-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div
              class="bg-image card shadow-1-strong mt-3"
              style={{ backgroundImage: `url(${AnalyticsBackground})` }}
            >
              <div class="card-body text-white">
                <h2>{username}'s dashboard</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-3">
            <StatisticsCard
              title={"Active Subscribers"}
              currentStat={activeSubscribers}
              prevStat={prevActiveSubscribers}
            />
          </div>
          <div class="col-3">
            <StatisticsCard
              title={"Active Followers"}
              currentStat={activeFollowers}
              prevStat={prevActiveFollowers}
            />
          </div>
          <div class="col-3">
            <StatisticsCard
              title={"Total Views"}
              currentStat={views}
              prevStat={prevViews}
            />
          </div>
          <div class="col-3">
            <StatisticsCard
              title={"Total earnings"}
              currentStat={earnings}
              prevStat={prevEarnings}
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div className={classes.root}>
                  <Tabs
                    orientation="vertical"
                    value={value}
                    onChange={handleChange}
                    className={classes.tabs}
                  >
                    <Tab label="Subscribers" {...a11yProps(0)} />
                    <Tab label="Followers" {...a11yProps(1)} />
                    <Tab label="Viewers" {...a11yProps(2)} />
                    <Tab label="Earnings" {...a11yProps(3)} />
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={subscribersOptions}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={followersOptions}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={viewsOptions}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={earningsOptions}
                    />
                  </TabPanel>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <div class="card">
              <div class="card-body">
                <HighchartsReact highcharts={Highcharts} options={optionsPie} />
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="card">
              <div class="card-body">
                <Typography variant="h6" className={classes.title}>
                  Topics your viewers are also interested in:
                </Typography>
                <div className={classes.demo}>
                  <List>
                    {[0, 1, 2, 3].map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText primary="Single-line item" />
                      </ListItem>
                    ))}
                  </List>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
