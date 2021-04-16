import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useAlert } from "react-alert";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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
  const [value, setValue] = useState(0);

  const [username, setUsername] = useState();

  const [prevActiveSubscribers, setPrevActiveSubscribers] = useState();
  const [activeSubscribers, setActiveSubscribers] = useState();
  const [subscribersChartOptions, setSubscribersChartOptions] = useState(
    createLineChartOptions("Subscribers", "No. of Subscribers", [
      {
        name: "Subscribers",
        data: [],
      },
    ])
  );

  const [prevActiveFollowers, setPrevActiveFollowers] = useState();
  const [activeFollowers, setActiveFollowers] = useState();
  const [followersChartOptions, setFollowersChartOptions] = useState(
    createLineChartOptions("Followers", "No. of Followers", [
      {
        name: "Followers",
        data: [],
      },
    ])
  );

  const [prevViews, setPrevViews] = useState();
  const [views, setViews] = useState();
  const [viewsChartOptions, setViewsChartOptions] = useState(
    createLineChartOptions("Views", "No. of views", [
      {
        name: "Views",
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

  const [interestsOptions, setInterestsOptions] = useState();
  const [incomeOptions, setIncomeOptions] = useState();

  useEffect(() => {
    Api.getFollowers(currentUser)
      .done((followers) => {
        let interestsDemographics = [];
        let incomeDemographics = {
          NOT_EARNING: 0,
          LOW: 0,
          MIDDLE_LOW: 0,
          MIDDLE: 0,
          MIDDLE_HIGH: 0,
          HIGH: 0,
          CRA: 0,
        };
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
          if (followers[prop]["follower"].hasOwnProperty("incomeRange")) {
            let newIncome = followers[prop]["follower"]["incomeRange"];
            incomeDemographics[newIncome] = incomeDemographics[newIncome] + 1;
          }
        }
        setInterestsOptions(createPieChartOptions(interestsDemographics));
        setIncomeOptions(
          createBarChartOptions(Object.values(incomeDemographics))
        );
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
        // subscribers are cumulative
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
              name: "Subscribers",
              data: subscribersArray,
            },
          ],
        });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getFollowersAnalytics(currentUser)
      .done((followersAnalytics) => {
        // followers are cumulative
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
              name: "Followers",
              data: followersArray,
            },
          ],
        });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getViewersAnalytics(currentUser)
      .done((viewersAnalytics) => {
        // views are not cumulative, we make it cumulative
        let viewsArray = Object.entries(viewersAnalytics);
        let date = new Date();
        let today = date.getTime();
        let yesterday = today - 86400000;
        let todaysViews = 0;
        let yesterdaysViews = 0;
        viewsArray
          .sort(function (a, b) {
            return a[0].parseInt(a[0], 10) - b[0].parseInt(b[0], 10);
          })
          .forEach((element) => {
            element[0] = parseInt(element[0], 10);
            if (element[0] <= today) {
              todaysViews += element[1];
            }
            if (element[0] <= yesterday) {
              yesterdaysViews += element[1];
            }
          });

        setPrevViews(yesterdaysViews);
        setViews(todaysViews);
        setViewsChartOptions({
          ...viewsChartOptions,
          series: [
            {
              name: "Views",
              data: viewsArray,
            },
          ],
        });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });

    Api.getEarningsAnalytics(currentUser)
      .done((earningsAnalytics) => {
        // earnings are not cumulative, , we make it cumulative
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
              todaysTotalEarnings += element[1];
            }
            if (element[0] <= yesterday) {
              yesterdaysTotalEarnings += element[1];
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
  }, []);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const createPieChartOptions = (seriesData) => {
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

  const createBarChartOptions = (incomeData) => {
    return {
      chart: {
        type: "bar",
      },
      title: {
        text: "Your Followers' Income Range",
      },
      subtitle: {
        text: "Annual income",
      },
      xAxis: {
        categories: [
          "Not Earning",
          "0-25K",
          "25-45K",
          "45-90K",
          "90-150K",
          "150-200K",
          ">200K",
        ],
        title: {
          text: null,
        },
        allowDecimals: false,
      },
      yAxis: {
        min: 0,
        title: {
          text: "Followers",
          align: "high",
        },
        labels: {
          overflow: "justify",
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "top",
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
        shadow: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Income range",
          data: incomeData,
        },
      ],
    };
  };

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
                      options={subscribersChartOptions}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={followersChartOptions}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={viewsChartOptions}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={earningsChartOptions}
                    />
                  </TabPanel>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <div class="card">
              <div class="card-body">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={interestsOptions}
                />
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="card">
              <div class="card-body">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={incomeOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
