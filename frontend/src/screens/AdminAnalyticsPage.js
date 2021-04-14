import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useAlert } from "react-alert";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Banned from "./AdminBannedAccessPage";
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

const createLineChartOptions = (title, yAxisTitle, seriesData) => {
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
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
          },
        },
      ],
    },
  };
};

export default function UserAnalytics() {
  const classes = useStyles();
  const alert = useAlert();
  const currentUser = useSelector((state) => state.currentUser);
  const isAdmin = useSelector((state) => state.isAdmin);
  const [value, setValue] = useState(0);

  const [username, setUsername] = useState();

  const [prevActiveUsers, setPrevActiveUsers] = useState();
  const [activeUsers, setActiveUsers] = useState();
  const [usersChartOptions, setUsersChartOptions] = useState(
    createLineChartOptions("Users", "No. of Users", [
      {
        name: "Users",
        data: [],
      },
    ])
  );

  const [prevActiveSubscribers, setPrevActiveSubscribers] = useState();
  const [activeSubscribers, setActiveSubscribers] = useState();
  const [subscribersChartOptions, setSubscribersChartOptions] = useState(
    createLineChartOptions("Subscribes", "No. of Subscribes", [
      {
        name: "Subscribes",
        data: [],
      },
    ])
  );

  const [prevActiveFollowers, setPrevActiveFollowers] = useState();
  const [activeFollowers, setActiveFollowers] = useState();
  const [followersChartOptions, setFollowersChartOptions] = useState(
    createLineChartOptions("Followings", "No. of Followings", [
      {
        name: "Followings",
        data: [],
      },
    ])
  );

  const [prevEarnings, setPrevEarnings] = useState();
  const [earnings, setEarnings] = useState();
  const [earningsChartOptions, setEarningsChartOptions] = useState(
    createLineChartOptions("Earnings", "Total earnings", [
      {
        name: "Earnings",
        data: [],
      },
    ])
  );

  const [prevPosts, setPrevPosts] = useState();
  const [posts, setPosts] = useState();
  const [postsChartOptions, setPostsChartOptions] = useState(
    createLineChartOptions("Posts", "No. of posts", [
      {
        name: "Posts",
        data: [],
      },
    ])
  );

  const [prevStreams, setPrevStreams] = useState();
  const [streams, setStreams] = useState();
  const [streamsChartOptions, setStreamsChartOptions] = useState(
    createLineChartOptions("Streams", "No. of streams", [
      {
        name: "Streams",
        data: [],
      },
    ])
  );

  const [interestsOptions, setInterestsOptions] = useState();
  const [incomeOptions, setIncomeOptions] = useState();

  useEffect(() => {
    Api.getAdminById(currentUser)
      .done((admin) => {
        setUsername(admin.username);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getSiteWideOnboardingAnalytics()
      .done((usersAnalytics) => {
        let usersArray = Object.entries(usersAnalytics);
        let date = new Date();
        let today = date.getTime();
        let yesterday = today - 86400000;
        let todaysUsers = 0;
        let yesterdaysUsers = 0;
        usersArray
          .sort(function (a, b) {
            return a[0].parseInt(a[0], 10) - b[0].parseInt(b[0], 10);
          })
          .forEach((element) => {
            element[0] = parseInt(element[0], 10);
            if (element[0] <= today) {
              todaysUsers = element[1];
            }
            if (element[0] <= yesterday) {
              yesterdaysUsers = element[1];
            }
          });

        setPrevActiveUsers(yesterdaysUsers);
        setActiveUsers(todaysUsers);
        setUsersChartOptions({
          ...usersChartOptions,
          series: [
            {
              name: "Users",
              data: usersArray,
            },
          ],
        });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getSiteWideSubscribersAnalytics()
      .done((subscribersAnalytics) => {
        let subscribersArray = Object.entries(subscribersAnalytics);
        let date = new Date();
        let today = date.getTime();
        let yesterday = today - 86400000;
        let todaysSubscribers = 0;
        let yesterdaysSubscribers = 0;
        subscribersArray
          .sort(function (a, b) {
            return a[0].parseInt(a[0], 10) - b[0].parseInt(b[0], 10);
          })
          .forEach((element) => {
            element[0] = parseInt(element[0], 10);
            if (element[0] <= today) {
              todaysSubscribers = element[1];
            }
            if (element[0] <= yesterday) {
              yesterdaysSubscribers = element[1];
            }
          });

        setPrevActiveSubscribers(yesterdaysSubscribers);
        setActiveSubscribers(todaysSubscribers);
        setSubscribersChartOptions({
          ...subscribersChartOptions,
          series: [
            {
              name: "Subscribes",
              data: subscribersArray,
            },
          ],
        });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getSiteWideFollowersAnalytics()
      .done((followersAnalytics) => {
        let followersArray = Object.entries(followersAnalytics);
        let date = new Date();
        let today = date.getTime();
        let yesterday = today - 86400000;
        let todaysFollowers = 0;
        let yesterdaysFollowers = 0;
        followersArray
          .sort(function (a, b) {
            return a[0].parseInt(a[0], 10) - b[0].parseInt(b[0], 10);
          })
          .forEach((element) => {
            element[0] = parseInt(element[0], 10);
            if (element[0] <= today) {
              todaysFollowers = element[1];
            }
            if (element[0] <= yesterday) {
              yesterdaysFollowers = element[1];
            }
          });

        setPrevActiveFollowers(yesterdaysFollowers);
        setActiveFollowers(todaysFollowers);
        setFollowersChartOptions({
          ...followersChartOptions,
          series: [
            {
              name: "Followings",
              data: followersArray,
            },
          ],
        });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getSiteWideEarningsAnalytics()
      .done((earningsAnalytics) => {
        let earningsArray = Object.entries(earningsAnalytics);
        let tally = 0;
        earningsArray.forEach((element) => {
          element[0] = parseInt(element[0], 10);
          tally += element[0];
          element[0] = tally;
        });
        let date = new Date();
        let today = date.getTime();
        let yesterday = today - 86400000;
        let todaysTotalEarnings = 0;
        let yesterdaysTotalEarnings = 0;
        earningsArray
          .sort(function (a, b) {
            return a[0] - b[0];
          })
          .forEach((element) => {
            if (element[0] <= today) {
              todaysTotalEarnings = element[1];
            }
            if (element[0] <= yesterday) {
              yesterdaysTotalEarnings = element[1];
            }
          });
        setPrevEarnings(yesterdaysTotalEarnings);
        setEarnings(todaysTotalEarnings);
        setEarningsChartOptions({
          ...earningsChartOptions,
          series: [
            {
              name: "Earnings",
              data: earningsArray,
            },
          ],
        });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getSiteWidePostsAnalytics()
      .done((postsAnalytics) => {
        let postsArray = Object.entries(postsAnalytics);
        let date = new Date();
        let today = date.getTime();
        let yesterday = today - 86400000;
        let todaysPosts = 0;
        let yesterdaysPosts = 0;
        postsArray
          .sort(function (a, b) {
            return a[0].parseInt(a[0], 10) - b[0].parseInt(b[0], 10);
          })
          .forEach((element) => {
            element[0] = parseInt(element[0], 10);
            if (element[0] <= today) {
              todaysPosts = element[1];
            }
            if (element[0] <= yesterday) {
              yesterdaysPosts = element[1];
            }
          });

        setPrevPosts(yesterdaysPosts);
        setPosts(todaysPosts);
        setPostsChartOptions({
          ...postsChartOptions,
          series: [
            {
              name: "Posts",
              data: postsArray,
            },
          ],
        });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getSiteWideStreamsAnalytics()
      .done((streamsAnalytics) => {
        let streamsArray = Object.entries(streamsAnalytics);
        let date = new Date();
        let today = date.getTime();
        let yesterday = today - 86400000;
        let todaysStreams = 0;
        let yesterdaysStreams = 0;
        streamsArray
          .sort(function (a, b) {
            return a[0].parseInt(a[0], 10) - b[0].parseInt(b[0], 10);
          })
          .forEach((element) => {
            element[0] = parseInt(element[0], 10);
            if (element[0] <= today) {
              todaysStreams = element[1];
            }
            if (element[0] <= yesterday) {
              yesterdaysStreams = element[1];
            }
          });

        setPrevStreams(yesterdaysStreams);
        setStreams(todaysStreams);
        setStreamsChartOptions({
          ...streamsChartOptions,
          series: [
            {
              name: "Streams",
              data: streamsArray,
            },
          ],
        });
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

  return isAdmin == true ? (
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
              title={"Total Users"}
              currentStat={activeUsers}
              prevStat={prevActiveUsers}
            />
          </div>
          <div class="col-3">
            <StatisticsCard
              title={"Total Posts"}
              currentStat={posts}
              prevStat={prevPosts}
            />
          </div>
          <div class="col-3">
            <StatisticsCard
              title={"Total Streams"}
              currentStat={streams}
              prevStat={prevStreams}
            />
          </div>
          <div class="col-3">
            <StatisticsCard
              title={"Total revenue"}
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
                    <Tab label="Users" {...a11yProps(0)} />
                    <Tab label="Subscribers" {...a11yProps(1)} />
                    <Tab label="Followers" {...a11yProps(2)} />
                    <Tab label="Revenue" {...a11yProps(3)} />
                    <Tab label="Posts" {...a11yProps(4)} />
                    <Tab label="Streams" {...a11yProps(5)} />
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={usersChartOptions}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={subscribersChartOptions}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={followersChartOptions}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={earningsChartOptions}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={4}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={postsChartOptions}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={5}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={streamsChartOptions}
                    />
                  </TabPanel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Banned />
  );
}
