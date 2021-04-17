import React from "react";
import { Link } from "react-router-dom";
import { Card, Box, CardContent } from "@material-ui/core";
import defaultDP from "../../assets/Default Dp logo.svg";

export default function RecommendedVideoCardItem({ video }) {
  return (
    <div>
      <div className="row">
        <video
          width="100%"
          height={130}
          className="clip-thumbnail"
          src={video.fileUrl}
        />
      </div>
      <div className="row">
        <div className="col-4">
          <Link to={"/profile/" + video.author.id}>
            <img
              className="img-fluid rounded-circle"
              style={{ height: "38px", width: "38px" }}
              src={video.author.profilePicture || defaultDP}
            />
          </Link>
        </div>
        <div className="col-8"></div>
      </div>
    </div>
  );
}
