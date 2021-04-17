import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import PostListOfFollowing from "../components/CommunityPage/PostListOfFollowing";
import YourCommunitiesCard from "../components/CommunityPage/YourCommunitiesCard";
import TopCommunitiesCard from "../components/CommunityPage/TopCommunitiesCard";
import SideAd from "../assets/SideAd.png";
import PointsBanner from "../assets/PointsBanner.png";
import VideosStreamedBadge from "../assets/badges/VideosStreamedBadge.png";
import FollowersBadge from "../assets/badges/FollowersBadge.png";
import PostsBadge from "../assets/badges/PostsBadge.png";
import Level1 from "../assets/badges/Level1.png";
import Level2 from "../assets/badges/Level2.png";
import Level3 from "../assets/badges/Level3.png";
import Level4 from "../assets/badges/Level4.png";
import Level5 from "../assets/badges/Level5.png";
import Level6 from "../assets/badges/Level6.png";
import Level7 from "../assets/badges/Level7.png";
import Level8 from "../assets/badges/Level8.png";
import Level9 from "../assets/badges/Level9.png";
import Level10 from "../assets/badges/Level10.png";



import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Api from "../helpers/Api";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

export default function PointsPage() {
  const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText("#3B21CB"),
      backgroundColor: "#3B21CB",
      "&:hover": {
        backgroundColor: "#260eab",
      },
    },
  }))(Button);

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  const classes = useStyles();


  function levelBadgeData(badge, achievement) {
    return { badge, achievement };
  }

  function pointData(action, points) {
    return { action, points };
  }

  function specBadgeData(badge, name, achievement) {
    return { badge, name, achievement };
  }

  const levelBadges = [
    levelBadgeData(<img src={Level1} alt="Level1" width="52" height="60" />, 0),
    levelBadgeData(<img src={Level2} alt="Level2" width="52" height="60" />, 10),
    levelBadgeData(<img src={Level3} alt="Level3" width="52" height="60" />, 30),
    levelBadgeData(<img src={Level4} alt="Level4" width="52" height="60" />, 80),
    levelBadgeData(<img src={Level5} alt="Level5" width="52" height="60" />, 150),
    levelBadgeData(<img src={Level6} alt="Level6" width="52" height="60" />, 300),
    levelBadgeData(<img src={Level7} alt="Level7" width="52" height="60" />, 800),
    levelBadgeData(<img src={Level8} alt="Level8" width="52" height="60" />, 1700),
    levelBadgeData(<img src={Level9} alt="Level9" width="52" height="60" />, 3500),
    levelBadgeData(<img src={Level10} alt="Level10" width="52" height="60" />, 7000),
  ];

  const pointBadges = [
    pointData("Comment/Reply", 159),
    pointData("Post", 159),
    pointData("Livestream", 159),
  ];

  const specialBadges = [
    specBadgeData(<img src={PostsBadge} alt="PostsBadge" width="60" height="60" />, "Captain Active", "Make 1000 posts"),
    specBadgeData(<img src={FollowersBadge} alt="FollowersBadge" width="60" height="60" />, "Viral Influencer", "Gain 1000 followers"),
    specBadgeData(<img src={VideosStreamedBadge} alt="VideosStreamedBadge" width="60" height="60" />, "Streamer Supreme", "Stream 100 videos"),
  ];

  const currentUser = useSelector((state) => state.currentUser);
  const [topCommunities, setTopCommunities] = useState([]);

  useEffect(() => {
    Api.getTopCommunities()
      .done((topCommunities) => {
        setTopCommunities(topCommunities);
        console.log(topCommunities);
      })
      .fail((xhr, status, error) => {
        alert("Error!");
      });
  }, []);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        <div className="row">
          <div className="col-md-9 mt-4">
            <div className="card card-primary">
              <div className="card-body container">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "gray",
                    padding: 5,

                  }}
                >
                  <div className="row">
                    <img src={PointsBanner} alt="PointsBanner"
                      style={{
                        alignItems: "center",
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                </div>
                <p></p>
                <div className="row">
                  <h2 style={{ color: "#4A5056", textAlign: "center", paddingTop: "10px" }}><b>We love having you here. That's why we'll reward you for it.</b></h2>
                </div>
                <p></p>
                <div className="row">
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" style={{ fontSize: 16, color: '#4A5056' }} > Badge</TableCell>
                          <TableCell align="center" style={{ fontSize: 16, color: '#4A5056' }}> Points required</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {levelBadges.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell align="center" style={{ width: '50%' }}>{row.badge}</TableCell>
                            <TableCell align="center" style={{ fontSize: 16 }}>{row.achievement}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>

                <div className="row" style={{ paddingTop: "50px" }}>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" style={{ fontSize: 16, color: '#4A5056' }} > Action</TableCell>
                          <TableCell align="center" style={{ fontSize: 16, color: '#4A5056' }}> Points</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pointBadges.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell align="center" style={{ width: '30%' }}>{row.action}</TableCell>
                            <TableCell align="center" style={{ fontSize: 16 }}>{row.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>

                <div className="row" style={{ paddingTop: "50px" }}>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" style={{ fontSize: 16, color: '#4A5056' }} > Badge</TableCell>
                          <TableCell align="center" style={{ fontSize: 16, color: '#4A5056' }} > Name</TableCell>
                          <TableCell align="center" style={{ fontSize: 16, color: '#4A5056' }}> Achievement</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {specialBadges.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell align="center" style={{ width: '30%' }}>{row.badge}</TableCell>
                            <TableCell align="center" style={{ fontSize: 15, width: '40%' }}>{row.name}</TableCell>
                            <TableCell align="center">{row.achievement}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>

              </div>
            </div>
          </div>
          <div
            className="col-md-3 mt-4"
            style={{ textAlign: "left", paddingTop: "10px" }}
          >
            <div className="card card-primary">
              <div className="card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={SideAd} alt="SideAd" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
