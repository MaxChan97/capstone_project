import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector } from "react-redux";
import TopBar from "../components/CommunityPage/OwnTopBar";
import CreatePostCard from "../components/CommunityPage/CreatePostCard";
import ProfilePostCard from "../components/CommunityPage/ProfilePostCard";
import AboutMe from "../components/CommunityPage/AboutMe";
import PostList from "../components/CommunityPage/PostList";
import SearchCard from "../components/CommunityPage/SearchCard";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";

export default function OwnCommunityPage({ communityId }) {
  const alert = useAlert();

  const [currentCommunity, setCurrentCommunity] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [refresh, setRefresh] = useState(true);
  const [communityBanner, setCommunityBanner] = useState("");
  const [communityPicture, setCommunityPicture] = useState("");

  const [searchString, setSearchString] = useState("");

  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      loadData(communityId);
    }
  }, [communityId, refresh]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function loadData(communityId) {
    Api.getCommunityById(communityId, currentUser)
      .done((currentCommunity) => {
        console.log(currentCommunity);
        setCurrentCommunity(currentCommunity);
        setCommunityBanner(currentCommunity.communityBanner);
        setCommunityPicture(currentCommunity.communityProfilePicture);
      })
      .fail((xhr, status, error) => {
        alert.show("This community does not exist!");
      });
  }

  const handleTabView = (tabValue) => {
    if (currentCommunity.id !== undefined && tabValue === 0) {
      return (
        <div className="container mt-3 ">
          <div className="row">
            <div className="col-md-8">
              <CreatePostCard
                community={currentCommunity}
                refresh={refresh}
                setRefresh={setRefresh}
              />
              <PostList
                community={currentCommunity}
                refresh={refresh}
                setRefresh={setRefresh}
                searchString={searchString}
              />
            </div>
            <div className="col-md-4" style={{ textAlign: "left" }}>
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
        communityPicture={communityPicture}
        communityBanner={communityBanner}
        numMembers={currentCommunity.members.length}
        communityId={communityId}
        personId={currentUser}
        setCommunityBanner={setCommunityBanner}
        refresh={refresh}
        setRefresh={setRefresh}
        communityOwner={currentCommunity.owner}
        setCommunityPicture={setCommunityPicture}
      />
      {handleTabView(tabValue)}
    </div>
  ) : null;
}
