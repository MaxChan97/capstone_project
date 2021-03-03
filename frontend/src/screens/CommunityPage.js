import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector } from "react-redux";
import OwnCommunityPage from "./OwnCommunityPage";
import AnotherCommunityPage from "./AnotherCommunityPage";
import Api from "../helpers/Api";

export default function ProfilePage() {
  const { communityId } = useParams();

  const currentUser = useSelector((state) => state.currentUser);
  const [currentCommunity, setCurrentCommunity] = useState({});
  const [ownedCommunities, setOwnedCommunities] = useState({});

  const [refresh, setRefresh] = useState(true);
  useEffect(() => {
    if (currentUser) {
      loadData(communityId, currentUser);
    }
  }, [communityId]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function loadData(communityId, currentUser) {      
      Api.getOwnedCommunities(currentUser)
      .done((ownedCommunities) => {
        setOwnedCommunities(ownedCommunities);
      })
      .fail((xhr, status, error) => {
      alert.show("This user does not exist!");
      });

      Api.getCommunityById(communityId)
  function loadData(communityId) {
    Api.getCommunityById(communityId, currentUser)
      .done((currentCommunity) => {
        setCurrentCommunity(currentCommunity);
      })
      .fail((xhr, status, error) => {
      alert.show("This community does not exist!");
      });
  }
  console.log(ownedCommunities);
  console.log(currentCommunity);

  function searchForMatch(currentCommunity, ownedCommunities) {
    var i, owner = false;
    if(ownedCommunities !== undefined){
      for (i = 0; i < ownedCommunities.length; i++) {
        if(ownedCommunities[i].id === currentCommunity.id){
          owner = true;
          console.log(owner);
          break;
        }
      }

  const handleTabView = (tabValue) => {
    if (currentCommunity.id !== undefined && tabValue === 0) {
      return (
        <div className="container mt-3 ">
          <div className="row">
            <div className="col-md-8">
              <CreatePostCard community = {currentCommunity} refresh= {refresh} setRefresh={setRefresh}/>
              <PostList community = {currentCommunity} refresh= {refresh} setRefresh={setRefresh}/>
            </div>
            <div className="col-md-4" style={{ textAlign: "left" }}>
              <SearchCard />
            </div>
          </div>
        </div>
      );
    }
    console.log(owner);
    return owner;
  }

  return (
    <div>
      {searchForMatch(currentCommunity, ownedCommunities) === true ? (
        <OwnCommunityPage communityId={communityId} />
      ) : (
        <AnotherCommunityPage communityId={communityId} />
      )}
    </div>
  );
}
