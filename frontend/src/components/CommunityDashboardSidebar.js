import React from "react";
import { Link, useLocation } from "react-router-dom";
import profileLogo from "../assets/channelDashboardSidebar/profile.png";

export default function CommunityDashboardSidebar() {
  let location = useLocation();

  let communityId = location.pathname.split("/")[
    location.pathname.split("/").length - 2
  ];

  return (
    <aside className="main-sidebar sidebar-light-primary elevation-1">
      <h5
        style={{
          textAlign: "left",
          paddingLeft: "15px",
          paddingTop: "13px",
          fontWeight: "bold",
        }}
      >
        Community Dashboard
      </h5>
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              {location.pathname.split("/")[
                location.pathname.split("/").length - 1
              ] === "manageDetails" ? (
                <Link
                  to={"/community/" + communityId + "/manageDetails"}
                  className="nav-link"
                  style={{ backgroundColor: "#EAECEF" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={profileLogo}
                      className="nav-icon"
                      alt="profileLogo"
                    />
                    <p className="ml-2">Manage Details</p>
                  </div>
                </Link>
              ) : (
                <Link
                  to={"/community/" + communityId + "/manageDetails"}
                  className="nav-link"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={profileLogo}
                      className="nav-icon"
                      alt="profileLogo"
                    />
                    <p className="ml-2">Manage Details</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname.split("/")[
                location.pathname.split("/").length - 1
              ] === "manageMembers" ? (
                <Link
                  to={"/community/" + communityId + "/manageMembers"}
                  className="nav-link"
                  style={{ backgroundColor: "#EAECEF" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={profileLogo}
                      className="nav-icon"
                      alt="profileLogo"
                    />
                    <p className="ml-2">Manage Members</p>
                  </div>
                </Link>
              ) : (
                <Link
                  to={"/community/" + communityId + "/manageMembers"}
                  className="nav-link"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={profileLogo}
                      className="nav-icon"
                      alt="profileLogo"
                    />
                    <p className="ml-2">Manage Members</p>
                  </div>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
