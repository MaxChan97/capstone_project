import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import LiveTab from "../components/FollowingPage/LiveTab";
import ChannelsTab from "../components/FollowingPage/ChannelsTab"
import VideosTab from "../components/FollowingPage/VideosTab";
import FollowingPageTopBar from "../components/FollowingPage/FollowingPageTopBar";
import FollowingGroup from "../components/FollowingPage/FollowingGroup";
import Api from "../helpers/Api";


export default function FollowingPage() {
  const currentUser = useSelector((state) => state.currentUser);
  const [tabValue, setTabValue] = useState(0);
  const [refresh, setRefresh] = useState(true);

  const [followingList, setFollowingList] = useState([]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function loadData(currentUser) {
    Api.getFollowing(currentUser)
      .done((data) => {
        setFollowingList(data);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
  }

  const handleTabView = (tabValue) => {
    if (tabValue === 1) {
      if (currentUser != {}) {
        return (
          <div style={{ marginTop: "20px" }}>
            <LiveTab />
          </div>
        );
      } else {
        return "";
      }
    }
    if (tabValue === 2) {
      return (
        <div style={{ marginTop: "20px" }}>
          <VideosTab />
        </div>
      );
    }
    if (tabValue === 3) {
      return (
        <div style={{ marginTop: "20px" }}>
          <ChannelsTab />
        </div>
      );
    } else {
      return "";
    }
  };

  // return (
  //    <div className="content-wrapper">

  //      <div
  //        style={{
  //          display: "flex",
  //          flexDirection: "column",
  //          alignItems: "center",
  //        }}
  //      >
  //        <h1>Following Page</h1>
  //      </div>
  //    </div>
  //    <div className="content-wrapper">
  //    {currentUser != {} ? (
  //      <div>
  //        <OwnProfileTopBar
  //          tabValue={tabValue}
  //          setTabValue={setTabValue}
  //          username={currentUser.username}

  //        />
  //        {handleTabView(tabValue)}
  //      </div>
  //    ) : (
  //        ""
  //      )}
  //  </div>
  // );

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

