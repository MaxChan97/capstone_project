import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Api from "../../helpers/Api";

export default function SearchPersonResultRow({ person }) {
  const [numFollowers, setNumFollowers] = useState(0);
  useEffect(() => {
    Api.getFollowers(person.id)
      .done((followObjects) => {
        setNumFollowers(followObjects.length);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, []);

  return (
    <div className="container">
      <Link to={"/profile/" + person.id}>
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
              src={person.profilePicture}
              alt="Profile Picture"
            />
          </div>
          <div className="col-md-2">
            <p
              className="text-left"
              style={{ color: "black", fontSize: "18px" }}
            >
              {person.username}
              <br />
              <small>
                {numFollowers !== 1
                  ? numFollowers + " Followers"
                  : numFollowers + " Follower"}
              </small>
            </p>
          </div>
          <div className="col-md-6">
            <p className="text-left" style={{ color: "black" }}>
              {person.description.length > 130
                ? person.description.substring(0, 80) + "..."
                : person.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
