import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector } from "react-redux";
import TopBar from "../components/CommunityPage/AnotherTopBar";
import CreatePostCard from "../components/CommunityPage/CreatePostCard";
import ProfilePostCard from "../components/CommunityPage/ProfilePostCard";
import AboutMe from "../components/CommunityPage/AboutMe";
import PostList from "../components/CommunityPage/PostList";
import SearchCard from "../components/CommunityPage/SearchCard";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import BannedPage from "./BannedPage";

export default function AnotherCommunityPage({ communityId }) {
  const alert = useAlert();
  const history = useHistory();

  const [currentCommunity, setCurrentCommunity] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [refresh, setRefresh] = useState(true);

  const [searchString, setSearchString] = useState("");

  const currentUser = useSelector((state) => state.currentUser);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadData(communityId);
      Api.getFollowingCommunities(currentUser)
        .done((followObjects) => {
          let followingFlag = false;
          for (var i = 0; i < followObjects.length; i++) {
            if (Number(followObjects[i].id) === Number(communityId)) {
              followingFlag = true;
              setJoined(true);
              break;
            }
          }
          if (followingFlag === false) {
            setJoined(false);
          }
        })
        .fail((xhr, status, error) => {
          alert.show(xhr.responseJSON.error);
        });
    }
  }, [communityId, refresh]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function loadData(communityId) {
    Api.getCommunityById(communityId, currentUser)
      .done((currentCommunity) => {
        setCurrentCommunity(currentCommunity);
      })
      .fail((xhr, status, error) => {
        if (xhr.responseJSON.error === "You are banned from the community") {
          console.log("You are banned from the community");
        } else {
          alert.show(xhr.responseJSON.error);
        }
      });
  }

  const handleTabView = (tabValue) => {
    if (currentCommunity.id !== undefined && tabValue === 0) {
      return (
        <div className="container mt-3 ">
          <div className="row">
            <div className="col-md-9">
              {joined == true ? (
                <CreatePostCard
                  community={currentCommunity}
                  refresh={refresh}
                  setRefresh={setRefresh}
                ></CreatePostCard>
              ) : (
                ""
              )}
              <PostList
                community={currentCommunity}
                refresh={refresh}
                setRefresh={setRefresh}
                searchString={searchString}
              />
            </div>
            <div className="col-md-3" style={{ textAlign: "left" }}>
              <SearchCard
                searchString={searchString}
                setSearchString={setSearchString}
              />
            </div>
          </div>
        </div>
      );
    }
    if (tabValue === 1) {
      return (
        <AboutMe
          community={currentCommunity}
          refresh={refresh}
          setRefresh={setRefresh}
          communityOwner={currentCommunity.owner}
        />
      );
    }
    return "";
  };

  return currentCommunity.members !== undefined ? (
    <div className="content-wrapper">
      <TopBar
        tabValue={tabValue}
        setTabValue={setTabValue}
        communityName={currentCommunity.name}
        communityPicture={currentCommunity.communityProfilePicture}
        communityBanner={currentCommunity.communityBanner}
        numMembers={currentCommunity.members.length}
        communityId={communityId}
        refresh={refresh}
        setRefresh={setRefresh}
        communityOwner={currentCommunity.owner}
      />
      {handleTabView(tabValue)}
    </div>
  ) : null;
}
