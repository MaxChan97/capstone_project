import React, { useEffect, useState } from "react";
import defaultDP from "../../assets/Default Dp logo.svg";
import Api from "../../helpers/Api";


export default function FollowingRow({ channel }) {
  console.log(channel)
  const publisher = channel["publisher"]

  const [followingList, setFollowingList] = useState([]);

  // Get total num of followers for each channel
  function loadData(publisher) {

    Api.getFollowing(publisher["id"])
      .done((data) => {
        setFollowingList(data);
        console.log(publisher)
      })
      .fail((xhr, status, error) => {
        if (xhr, status, error === "Cannot find publisher") {
          alert.show("publisher not found");
        } else if (xhr, status, error === "Missing publisher id") {
          alert.show("The publisher ID is missing");
        }
      });
  }

  return (
    <div className="container">
      <div className="row">
        {/* <div className="col-md-2">
          <p className="text-left"> {person.username} </p>
        </div> */}
        <div className="col-md-3">
          <img className="img-fluid" src={publisher.profilePicture} alt="defaultDP" />
        </div>
        <div className="col-md-7">
        <dl>
          <dt className="text-left-bold">{publisher.username}</dt>
          <dd className="text-left-small">{followingList.length} followers</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
