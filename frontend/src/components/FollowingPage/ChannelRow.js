import React from "react";
import defaultDP from "../../assets/Default Dp logo.svg";

export default function FollowingRow({ channel }) {
  console.log(channel)
  const publisher = channel["publisher"]

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
          <p className="text-left">{publisher.username}</p>
        </div>
        // insert channel follower count here
      </div>
    </div>
  );
}
