import React from "react";
import defaultDP from "../../assets/Default Dp logo.svg";

export default function FollowerRow({ follower }) {
  const person = follower["follower"]

  return (
    <div className="container">
      <div className="row">
        {/* <div className="col-md-2">
          <p className="text-left"> {person.username} </p>
        </div> */}
        <div className="col-md-3">
          <img className="img-fluid" src={person.profilePicture} alt="defaultDP" />
        </div>
        <div className="col-md-7">
          <p className="text-left">{person.username}</p>
        </div>
      </div>
    </div>
  );
}
