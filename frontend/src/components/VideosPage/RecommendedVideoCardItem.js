import React from "react";
import { Link } from "react-router-dom";
import { Card, Box, CardContent } from "@material-ui/core";
import defaultDP from "../../assets/Default Dp logo.svg";
import { useHistory } from "react-router";

export default function RecommendedVideoCardItem({ video }) {
  const history = useHistory();

  return (
    <div>
      <div
        className="row"
        onClick={() => {
          history.push("/video/" + video.id);
          window.location.reload();
        }}
        style={{ cursor: "pointer" }}
      >
        <video
          width="100%"
          height={130}
          className="clip-thumbnail"
          src={video.fileUrl}
        />
      </div>
      <div className="row">
        <div className="col-3 pt-2">
          <Link to={"/profile/" + video.author.id}>
            <img
              className="img-fluid rounded-circle"
              src={video.author.profilePicture || defaultDP}
            />
          </Link>
        </div>
        <div className="col-9" style={{ lineHeight: "1.1" }}>
          <p className="font-weight-bold m-0 p-0">
            <Link to={"/video/" + video.id} style={{ color: "inherit" }}>
              {video.title}
            </Link>
          </p>
          <p className="m-0 p-0 text-secondary">
            <Link
              to={"/profile/" + video.author.id}
              style={{ color: "inherit" }}
            >
              {video.author.username}
            </Link>
          </p>
          <p className="m-0 p-0 text-secondary">{video.noOfViews} views</p>
        </div>
      </div>
    </div>
  );
}
