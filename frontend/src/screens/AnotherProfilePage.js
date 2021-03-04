import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import AnotherProfileTopBar from "../components/ProfilePage/AnotherProfilePage/AnotherProfileTopBar";
import ProfilePostCard from "../components/ProfilePage/ProfilePostCard";
import AboutMe from "../components/ProfilePage/AboutMe";
import PostList from "../components/ProfilePage/PostList";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";

export default function AnotherProfilePage({ personId }) {
  const alert = useAlert();

  const [anotherPerson, setAnotherPerson] = useState({});
  const [numFollowers, setNumFollowers] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (personId) {
      loadData(personId);
    }
  }, [personId, refresh]);

  function loadData(personId) {
    Api.getPersonById(personId)
      .done((anotherPerson) => {
        setAnotherPerson(anotherPerson);
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
    if (tabValue === 1) {
      if (anotherPerson != {}) {
        return (
          <div style={{ marginTop: "20px" }}>
            <PostList
              personId={personId}
              refresh={refresh}
              setRefresh={setRefresh}
            />
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
      {anotherPerson != {} ? (
        <div>
          <AnotherProfileTopBar
            tabValue={tabValue}
            setTabValue={setTabValue}
            username={anotherPerson.username}
            id={personId}
            numFollowers={numFollowers}
            pricingPlan={anotherPerson.pricingPlan}
            refresh={refresh}
            setRefresh={setRefresh}
            profilePicture={anotherPerson.profilePicture}
            profileBanner={anotherPerson.profileBanner}
          />
          {handleTabView(tabValue)}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
