import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import OwnProfileTopBar from "../components/ProfilePage/OwnProfilePage/OwnProfileTopBar";
import CreatePostCard from "../components/ProfilePage/OwnProfilePage/CreatePostCard";
import ProfilePostCard from "../components/ProfilePage/ProfilePostCard";
import AboutMe from "../components/ProfilePage/AboutMe";
import PostList from "../components/ProfilePage/PostList";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";

export default function OwnProfilePage({ personId }) {
  const alert = useAlert();

  const [tabValue, setTabValue] = useState(0);
  const [currentPerson, setCurrentPerson] = useState({});
  const [refresh, setRefresh] = useState(true);

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
  }

  const handleTabView = (tabValue) => {
    if (tabValue === 1) {
      if (currentPerson != {}) {
        return (
          <div style={{ marginTop: "20px" }}>
            <CreatePostCard
              personId={personId}
              refresh={refresh}
              setRefresh={setRefresh}
            />
            <PostList personId={personId} refresh={refresh} />
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
      {currentPerson != {} && currentPerson.followers != null ? (
        <div>
          <OwnProfileTopBar
            tabValue={tabValue}
            setTabValue={setTabValue}
            username={currentPerson.username}
            numFollowers={currentPerson.followers.length}
          />
          {handleTabView(tabValue)}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
