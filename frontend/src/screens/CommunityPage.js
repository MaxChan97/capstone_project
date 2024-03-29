import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector } from "react-redux";
import OwnCommunityPage from "./OwnCommunityPage";
import AnotherCommunityPage from "./AnotherCommunityPage";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";

export default function ProfilePage() {
  const { communityId } = useParams();

  const currentUser = useSelector((state) => state.currentUser);
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [ownedCommunities, setOwnedCommunities] = useState({});

  const history = useHistory();
  const alert = useAlert();

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

    Api.getCommunityById(communityId, currentUser)
      .done((currentCommunity) => {
        setCurrentCommunity(currentCommunity);
      })
      .fail((xhr, status, error) => {
        if (xhr.responseJSON.error === "You are banned from the community") {
          history.push("/community/" + communityId + "/banned");
        } else {
          history.push("/deleted/community");
        }
      });
  }
  console.log(ownedCommunities);
  console.log(currentCommunity);

  function searchForMatch(currentCommunity) {
    var i,
      owner = false;
    if (ownedCommunities !== undefined) {
      for (i = 0; i < ownedCommunities.length; i++) {
        if (ownedCommunities[i].id === currentCommunity.id) {
          owner = true;
          console.log(owner);
          break;
        }
      }
    }
    return owner;
  }

  return currentCommunity != null ? (
    <div>
      {currentCommunity.owner.id === currentUser ? (
        <OwnCommunityPage communityId={communityId} />
      ) : (
        <AnotherCommunityPage communityId={communityId} />
      )}
    </div>
  ) : ("");
}
