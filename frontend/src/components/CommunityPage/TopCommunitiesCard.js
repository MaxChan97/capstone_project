import React from "react";
import Box from "@material-ui/core/Box";
import defaultDP from "../../assets/Default Dp logo.svg";

export default function TopCommunitiesCard({ data }) {
  return (
    <div className="card card-primary">
      <div className="card-body">
        <h5 className="font-weight-bold mb-3">Top Communities</h5>
        {data.map((community, index) => {
          return (
            <div key={index}>
              <a href={"/community/" + community["id"]}>
                <div className="container" style={{ color: "black" }}>
                  <div className="row">
                    <div className="col-4">
                      <img
                        className="img-fluid img-circle mx-auto d-block"
                        src={community["communityProfilePicture"] || defaultDP}
                        alt="Community Picture"
                      />
                    </div>
                    <div className="col-8">
                      <p className="text-left" style={{ color: "black" }}>
                        {community.name}
                        <br />
                        <small>
                          {community.members.length !== 1
                            ? community.members.length + " Members"
                            : community.members.length + " Member"}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
