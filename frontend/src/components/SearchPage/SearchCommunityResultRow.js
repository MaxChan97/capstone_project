import React from "react";
import owner from "../../assets/Owned.svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function SearchCommunityResultRow({ community }) {
  const currentUser = useSelector((state) => state.currentUser);

  return (
    <div className="container">
      <Link to={"/community/" + community.id}>
        <div className="row mt-3">
          <div className="col-md-2">
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
          <div className="col-md-2">
            <p
              className="text-left"
              style={{ color: "black", fontSize: "18px" }}
            >
              {community.name}
              <br />
              <small>
                {community.members.length !== 1
                  ? community.members.length + " Members"
                  : community.members.length + " Member"}
              </small>
            </p>
          </div>
          <div className="col-md-6">
            <p className="text-left" style={{ color: "black" }}>
              {community.description.length > 130
                ? community.description.substring(0, 80) + "..."
                : community.description}
            </p>
          </div>
          <div className="col-md-1">
            {community.owner.id === currentUser ? (
              <img
                style={{
                  float: "right",
                  margin: "10px 0px",
                }}
                src={owner}
                alt="Owner Logo"
              />
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
}
