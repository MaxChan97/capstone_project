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
import VideosTab from "../components/ProfilePage/VideosTab";

export default function OwnProfilePage({ personId }) {
  const alert = useAlert();

  const [tabValue, setTabValue] = useState(0);
  const [currentPerson, setCurrentPerson] = useState({});
  const [refresh, setRefresh] = useState(true);
  const [numFollowers, setNumFollowers] = useState(0);
  const [badge, setBadge] = useState();
  const [profileBanner, setProfileBanner] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    if (personId) {
      loadData(personId);
    }
  }, [personId, refresh]);

  function loadData(personId) {
    Api.getPersonById(personId)
      .done((currentPerson) => {
        setCurrentPerson(currentPerson);
        setBadge(currentPerson.badgeDisplaying);
        setProfileBanner(currentPerson.profileBanner);
        setProfilePicture(currentPerson.profilePicture);
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
      return (
        <VideosTab
          personId={personId}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      );
    } else if (tabValue === 1) {
      if (currentPerson != {}) {
        return (
          <div style={{ marginTop: "20px" }}>
            <div style={{ margin: "auto" }}>
              <div className="col-md-9 mt-4" style={{ margin: "auto" }}>
                <CreatePostCard
                  personId={personId}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  profilePicture={currentPerson.profilePicture}
                />
              </div>
              <div className="col-md-9 mt-4" style={{ margin: "auto" }}>
                <PostList
                  personId={personId}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              </div>
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
          <AboutMe
            person={currentPerson}
            refresh={refresh}
            setRefresh={setRefresh}
          />
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
            profilePicture={profilePicture}
            profileBanner={profileBanner}
            badge={badge}
            setProfileBanner={setProfileBanner}
            refresh={refresh}
            setRefresh={setRefresh}
            personId={personId}
            setProfilePicture={setProfilePicture}
            user={currentPerson}
          />
          {handleTabView(tabValue)}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
