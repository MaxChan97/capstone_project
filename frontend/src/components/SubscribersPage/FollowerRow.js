import React from "react";
import defaultDP from "../../assets/Default Dp logo.svg";

export default function FollowerRow({ follower }) {

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-2">
          <p className="text-left"> {follower.name} </p>
        </div>
        <div className="col-md-3">
          <img className="img-fluid" src={defaultDP} alt="defaultDP" />
        </div>
        <div className="col-md-7">
          <p className="text-left">{follower.name}</p>
        </div>
      </div>
    </div>
  );
}
