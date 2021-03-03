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

export default function AnotherCommunityPage({communityId}) {
  const alert = useAlert();

  const [currentCommunity, setCurrentCommunity] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [refresh, setRefresh] = useState(true);

  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      loadData(communityId);
    }
  }, [communityId]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function loadData(communityId) {
    Api.getCommunityById(communityId, currentUser)
      .done((currentCommunity) => {
        console.log(currentCommunity);
        setCurrentCommunity(currentCommunity);
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
              <PostList community = {currentCommunity} refresh= {refresh} setRefresh={setRefresh}/>
            </div>
            <div className="col-md-4" style={{ textAlign: "left" }}>
              <SearchCard />
            </div>
          </div>
        </div>
      );
    }
    if (tabValue === 1) {
      return <AboutMe />;
    }
    return "";
  };

  return (
    currentCommunity.members !== undefined ? (
      <div className="content-wrapper">
      <TopBar 
      tabValue={tabValue} 
      setTabValue={setTabValue} 
      communityName={currentCommunity.name}
      communityPicture= {currentCommunity.communityProfilePicture}
      communityBanner = {currentCommunity.communityBanner}
      numMembers = {currentCommunity.members.length}
      communityId = {communityId} 
      />
      {handleTabView(tabValue)}
    </div>
    ) : (null));
}
