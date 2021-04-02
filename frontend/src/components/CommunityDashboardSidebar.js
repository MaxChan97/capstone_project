import React from "react";
import { Link, useLocation } from "react-router-dom";
import profileLogo from "../assets/channelDashboardSidebar/profile.png";
import backLogo from "../assets/channelDashboardSidebar/back.png";
import BNBLogo from "../assets/BNB Logo.png";

export default function CommunityDashboardSidebar() {
  let location = useLocation();

  let communityId = location.pathname.split("/")[
    location.pathname.split("/").length - 2
  ];

  return (
    <aside
      className="main-sidebar sidebar-light-primary elevation-1"
      style={{ paddingTop: "10px" }}
    >
      <div>
        <Link to="/feed">
          <img
            style={{ height: "40px", display: "flex", paddingLeft: "24px" }}
            src={BNBLogo}
            alt="BNB Logo"
          />
        </Link>
      </div>
      <h5
        style={{
          textAlign: "left",
          paddingLeft: "24px",
          paddingTop: "10px",
          fontWeight: "bold",
          fontSize: "18px",
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
              <Link to={"/community/" + communityId} className="nav-link">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <img src={backLogo} className="nav-icon" alt="backLogo" />
                  <p className="ml-2">Back</p>
                </div>
              </Link>
            </li>
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
