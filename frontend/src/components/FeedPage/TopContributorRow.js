import React from "react";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";

export default function TopContributorRow({ data, rank }) {
  return (
    <Link to={"/profile/" + data.id}>
      <div style={{ color: "black" }}>
        <div className="row" style={{ marginBottom: "-25px" }}>
          <div className="col-md-3 p-0">
            <p className="text-left">{rank + 1}</p>
          </div>
          <div className="col-md-3 p-0">
            <img
              className="img-circle"
              style={{ height: "25px" }}
              src={data.profilePicture}
              alt="defaultDP"
            />
          </div>
          <div className="col-md-6 p-0">
            <p className="text-left">{data.username}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
