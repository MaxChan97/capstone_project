import React from "react";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";

export default function TopStreamerRow({ data, rank }) {
  return (
    <Link to={"/profile/" + data.id}>
      <div style={{ color: "black" }}>
        <div className="row">
          <div className="col-2">
            <p className="text-center">{rank + 1}</p>
          </div>
          <div className="col-3">
            <img
              className="img-circle float-left"
              src={data.profilePicture || defaultDP}
              alt="profile picture"
              style={{ width: "30px" }}
            />
          </div>
          <div className="col-7">
            <p className="text-left">{data.username}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
