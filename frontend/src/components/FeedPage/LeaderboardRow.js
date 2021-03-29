import React from "react";
import defaultDP from "../../assets/Default Dp logo.svg";

export default function LeaderboardRow({ data, rank}) {
  return (
    <div className="container" >
      <div className="row" style={{marginBottom: "-25px"}}>
        <div className="col-md-2">
          <p className="text-left">{rank + 1}</p>
        </div>
        <div className="col-md-3">
          <img className="img-circle" style={{height:"25px"}} src={data.profilePicture} alt="defaultDP" />
        </div>
        <div className="col-md-7">
          <p className="text-left">{data.username}</p>
        </div>
      </div>
    </div>
  );
}
