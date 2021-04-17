import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import LiveTab from "../components/SubscribingPage/LiveTab";
import ChannelsTab from "../components/SubscribingPage/ChannelsTab/ChannelsTab.js";
import VideosTab from "../components/SubscribingPage/VideosTab";
import SubscribingPageTopBar from "../components/SubscribingPage/SubscribingPageTopBar";
import SubscribingGroup from "../components/SubscribingPage/SubscribingGroup";
import Api from "../helpers/Api";

export default function SubscribingPage() {
  const currentUser = useSelector((state) => state.currentUser);
  const [tabValue, setTabValue] = useState(0);
  const [refresh, setRefresh] = useState(true);
  const [subscribingList, setsubscribingList] = useState([]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

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
          <ChannelsTab currentUser={currentUser} />
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
          <SubscribingPageTopBar
            tabValue={tabValue}
            setTabValue={setTabValue}
            username={currentUser.username}
            numSubscribing={subscribingList.length}
          />
          {handleTabView(tabValue)}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
