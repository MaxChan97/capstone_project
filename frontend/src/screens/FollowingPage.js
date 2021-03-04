import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import LiveTab from "../components/FollowingPage/LiveTab/LiveTab.js";
import ChannelsTab from "../components/FollowingPage/ChannelsTab/ChannelsTab.js"
import VideosTab from "../components/FollowingPage/VideosTab/VideosTab";
import FollowingPageTopBar from "../components/FollowingPage/FollowingPageTopBar";
import Api from "../helpers/Api";


export default function FollowingPage() {

  const currentUser = useSelector((state) => state.currentUser);
  const [tabValue, setTabValue] = useState(0);
  const [refresh, setRefresh] = useState(true);
  const [followingList, setFollowingList] = useState([]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  // function loadData(currentUser) {
  //   Api.getFollowing(currentUser)
  //     .done((data) => {
  //       setFollowingList(data);
  //       console.log(currentUser)
  //       console.log(followingList)
  //     })
  //     .fail((xhr, status, error) => {
  //       if (xhr, status, error === "Cannot find person") {
  //         alert.show("Person not found");
  //       } else if (xhr, status, error === "Missing person id") {
  //         alert.show("The person ID is missing");
  //       }
  //     });
  // }

  const handleTabView = (tabValue) => {
    if (tabValue === 0) {

      return (
        <div style={{ marginTop: "20px" }}>
          <LiveTab />
        </div>
      );

    }
    if (tabValue === 1) {
      return (
        <div style={{ marginTop: "20px" }}>
          <VideosTab />
        </div>
      );
    }
    if (tabValue === 2) {
      return (
        <div style={{ marginTop: "20px" }}>
          <ChannelsTab currentUser = {currentUser}/>
        </div>
      );
    } else {
      return "";
    }
  };

  return (
    <div className="content-wrapper">

      {currentUser != {} ? (
        <div>
          <FollowingPageTopBar
            tabValue={tabValue}
            setTabValue={setTabValue}
            username={currentUser.username}
            numFollowing={followingList.length}
          />
          {handleTabView(tabValue)}
        </div>
      ) : (
          ""
        )}
    </div>
  );
}

