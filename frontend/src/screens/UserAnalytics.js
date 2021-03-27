import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TabPanel from "../components/UserAnalyticsPage/TabPanel";
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
}));

export default function UserAnalytics() {
  const classes = useStyles();
  const currentUser = useSelector((state) => state.currentUser);
  const [value, setValue] = useState(0);
  const [followersMap, setFollowersMap] = useState();

  useEffect(() => {
    Api.getFollowersAnalytics(currentUser)
      .done((followersAnalytics) => {
        let followersMap = followersAnalytics.followersCount;
        console.log(typeof followersMap);
        console.log(followersMap);
        setFollowersMap(followersMap);
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

  //year, month, day
  const options1 = parseOptions("Subscribers", "No. of Subscribers", [
    {
      data: [
        [Date.UTC(2010, 0, 1), 29.9],
        [Date.UTC(2010, 2, 1), 71.5],
        [Date.UTC(2010, 3, 6), 106.4],
        [Date.UTC(2010, 4, 8), 129.9],
        [Date.UTC(2010, 5, 3), 171.5],
        [Date.UTC(2010, 6, 1), 196.4],
      ],
    },
  ]);

  const parseOptionsPie = (seriesData) => {
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        text: "Viewer demographics",
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
          name: "Brands",
          colorByPoint: true,
          data: seriesData,
        },
      ],
    };
  };

  const optionsPie = parseOptionsPie([
    {
      name: "Chrome",
      y: 61.41,
      sliced: true,
      selected: true,
    },
    {
      name: "Internet Explorer",
      y: 11.84,
    },
    {
      name: "Firefox",
      y: 10.85,
    },
    {
      name: "Edge",
      y: 4.67,
    },
    {
      name: "Safari",
      y: 4.18,
    },
    {
      name: "Sogou Explorer",
      y: 1.64,
    },
    {
      name: "Opera",
      y: 1.6,
    },
    {
      name: "QQ",
      y: 1.2,
    },
    {
      name: "Other",
      y: 2.61,
    },
  ]);

  return (
    <div className="content-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h4>Carl's dashboard</h4>
                <p>Some text..</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-3">
            <div class="card">
              <div class="card-body">
                <Statistic title="Active subscribers" value={112893} />
                <Statistic
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </div>
            </div>
          </div>
          <div class="col-3">
            <div class="card">
              <div class="card-body">
                <Statistic title="Active followers" value={11289332} />
                <Statistic
                  value={9.3}
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </div>
            </div>
          </div>
          <div class="col-3">
            <div class="card">
              <div class="card-body">
                <Statistic title="Total views" value={11289332} />
                <Statistic
                  value={9.3}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </div>
            </div>
          </div>
          <div class="col-3">
            <div class="card">
              <div class="card-body">
                <Statistic title="Total earnings" value={19236912} />
                <Statistic
                  value={"$ " + "699.30"}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                />
              </div>
            </div>
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
                      options={options1}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    Item Two
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    Item Three
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    Item Four
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
                <p>Suggested topics based on demographics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
