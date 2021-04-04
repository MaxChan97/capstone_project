import React from "react";
import Box from "@material-ui/core/Box";
import defaultDP from "../../assets/Default Dp logo.svg";

export default function TopCommunitiesCard({ data }) {
  return (
    <div className="card card-primary">
      <div className="card-body">
        <h5 className="font-weight-bold">Top Communities</h5>
        <ul className="list-group list-group-flush">
          {data.map((community, index) => {
            return (
              <li
                key={index}
                class="list-group-item list-group-item-action p-1"
              >
                <a href="#">
                  <div className="container-fluid" style={{ color: "black" }}>
                    <div className="row m-3">
                      <div className="col-md-4">
                        <img
                          className="img-fluid"
                          src={
                            community["communityProfilePicture"] || defaultDP
                          }
                        />
                      </div>
                      <div className="col-md-8">
                        <p className="text-left mb-0">{community.name}</p>
                        <p className="text-left">
                          {community["members"].length}{" "}
                          {community["members"].length == 1
                            ? "member"
                            : "members"}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
