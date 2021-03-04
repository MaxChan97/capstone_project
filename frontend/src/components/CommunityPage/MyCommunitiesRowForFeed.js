/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import owner from "../../assets/Owned.svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { colors } from "@material-ui/core";

export default function MyCommunitiesRowForFeed({ community }) {
  const currentUser = useSelector((state) => state.currentUser);

  return (
    <div className="container">
        <Link to={"/community/" + community.id} >
      <div className="row mt-3">
        <div className="col-md-4">
          <img
            style={{
              resizeMode: "repeat",
              height: 50,
              width: 50,
              borderRadius: "50%",
              display: "block",
            }}
            className="img-fluid"
            src={community.communityProfilePicture}
            alt="Community Picture"
          />
        </div>
        <div className="col-md-8">
          <p className="text-left"
          style={{color:"black", fontSize:"18px"}}>
            {community.name}
            <br />
            {/* <small>{community.members.length} Members</small> */}
            <small>{community.members.length !== 1
              ? community.members.length + " Members"
              : community.members.length + " Member"}</small>
          </p>
        </div>
      </div>
      </Link>
    </div>
  );
}
