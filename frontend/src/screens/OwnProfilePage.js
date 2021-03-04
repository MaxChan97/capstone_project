import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import OwnProfileTopBar from "../components/ProfilePage/OwnProfilePage/OwnProfileTopBar";
import CreatePostCard from "../components/ProfilePage/OwnProfilePage/CreatePostCard";
import ProfilePostCard from "../components/ProfilePage/ProfilePostCard";
import AboutMe from "../components/ProfilePage/AboutMe";
import PostList from "../components/ProfilePage/PostList";
import PostsSortdropdown from "../components/ProfilePage/PostsSortDropdown";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";

export default function OwnProfilePage({ personId }) {
  const alert = useAlert();

  const [tabValue, setTabValue] = useState(0);
  const [currentPerson, setCurrentPerson] = useState({});
  const [refresh, setRefresh] = useState(true);
  const [numFollowers, setNumFollowers] = useState(0);

  useEffect(() => {
    if (personId) {
      loadData(personId);
    }
  }, [personId]);

  function loadData(personId) {
    Api.getPersonById(personId)
      .done((currentPerson) => {
        setCurrentPerson(currentPerson);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
    Api.getFollowers(personId)
      .done((followObjects) => {
        setNumFollowers(followObjects.length);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  const handleTabView = (tabValue) => {
    if (tabValue === 0) {
      if (currentPerson != {}) {
        return (
          <div style={{ marginTop: "20px" }}>
            <div style={{ margin: "auto" }}>
              <CreatePostCard
                personId={personId}
                refresh={refresh}
                setRefresh={setRefresh}
                profilePicture={currentPerson.profilePicture}
              />
              <PostList
                personId={personId}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            </div>
          </div>
        );
      } else {
        return "";
      }
    }
    if (tabValue === 2) {
      return (
        <div style={{ marginTop: "20px" }}>
          <AboutMe />
        </div>
      );
    }
    return "";
  };

  return (
    <div className="content-wrapper">
      {currentPerson != {} ? (
        <div>
          <OwnProfileTopBar
            tabValue={tabValue}
            setTabValue={setTabValue}
            username={currentPerson.username}
            numFollowers={numFollowers}
            profilePicture={currentPerson.profilePicture}
            profileBanner={currentPerson.profileBanner}
          />
          {handleTabView(tabValue)}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
