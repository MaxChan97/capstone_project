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
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (personId) {
      loadData(personId);
    }
  }, []);

  function loadData(personId) {
    Api.getPersonById(personId)
      .done((anotherPerson) => {
        setAnotherPerson(anotherPerson);
        console.log(anotherPerson);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
  }

  const handleTabView = (tabValue) => {
    if (tabValue === 1) {
      return (
        <div style={{ marginTop: "20px" }}>
          <ProfilePostCard />
          <PostList />
        </div>
      );
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
      {anotherPerson != {} && anotherPerson.followers != null ? (
        <div>
          <AnotherProfileTopBar
            tabValue={tabValue}
            setTabValue={setTabValue}
            username={anotherPerson.username}
            numFollowers={anotherPerson.followers.length}
          />
          {handleTabView(tabValue)}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
