import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import SubscriberCard from "../components/SubscribersPage/SubscriberCard";
import FollowerCard from "../components/SubscribersPage/FollowerCard";
import SearchCard from "../components/SubscribersPage/SearchCard";



export default function FeedPage() {
  const followerList = [
    { name: "follower", rank: "1" },
    { name: "follower", rank: "2" },
    { name: "follower", rank: "3" },
    { name: "follower", rank: "4" },
    { name: "follower", rank: "5" },
    { name: "follower", rank: "6" },
    { name: "follower", rank: "7" },
    { name: "follower", rank: "8" },

  ];

  const subscriberList = [
    { name: "subber", rank: "1" },
    { name: "subber", rank: "2" },
    { name: "subber", rank: "3" },
    { name: "subber", rank: "4" },
    { name: "subber", rank: "5" },
    { name: "subber", rank: "6" },

  ];

  const [followerboard, setFollowerboard] = useState(followerList);
  const [subscriberboard, setSubscriberboard] = useState(subscriberList);

  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => { }, [subscriberList]);
  useEffect(() => { }, [subscriberboard]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
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
