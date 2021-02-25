import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector } from "react-redux";
import SubscriberCard from "../components/SubscribersPage/SubscriberCard";
import FollowerCard from "../components/SubscribersPage/FollowerCard";
import SearchCard from "../components/SubscribersPage/SearchCard";
import Api from "../helpers/Api";



export default function SubscriberPage() {
  const currentUser = useSelector((state) => state.currentUser);
  const [followerList, setFollowerList] = useState([]);
  const [subscriberList, setSubscriberList] = useState([]);
  const { personId } = useParams();

  const [currentPerson, setCurrentPerson] = useState({});

  useEffect(() => { 
    if (currentUser) {
      loadData(currentUser);
      console.log(currentUser);
    }
  }, [currentUser]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  //useEffect(() => { }, [subscriberList]);
  //useEffect(() => { }, [followerList]);

  function loadData(currentUser) {
    Api.getFollowers(currentUser.id)
      .done((currentUser) => {
        setFollowerList(followerList);
        console.log(currentPerson);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });

      Api.getSubscribers(currentUser.id)
      .done((currentUser) => {
        setSubscriberList(subscriberList);
        console.log(currentPerson);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
  }

  return (
    <div className="content-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mt-4" style={{ textAlign: "left" }}>
            <FollowerCard followerList={followerList} />
          </div>
          <div className="col-md-4 mt-4" style={{ textAlign: "left" }}>
            <SubscriberCard subscriberList={subscriberList} />
          </div>
          <div className="col-md-4 mt-4" style={{ textAlign: "left" }}>
            <SearchCard />
          </div>
        </div>
      </div>
    </div>
  );
}
