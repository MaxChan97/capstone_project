import React from "react";
import { Link, useLocation } from "react-router-dom";
import profileLogo from "../assets/channelDashboardSidebar/profile.png";
import subscribersLogo from "../assets/channelDashboardSidebar/subscribers.png";
import settingsLogo from "../assets/channelDashboardSidebar/settings.svg";
import changePasswordLogo from "../assets/channelDashboardSidebar/changePassword.png";
import liveLogo from "../assets/Live Logo.svg";
import BNBLogo from "../assets/BNB Logo.png";

export default function ChannelDashboardSidebar() {
  let location = useLocation();

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
        User Dashboard
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
              {location.pathname === "/customiseProfile" ? (
                <Link
                  to="/customiseProfile"
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
                    <p className="ml-2">Profile</p>
                  </div>
                </Link>
              ) : (
                <Link to="/customiseProfile" className="nav-link">
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
                    <p className="ml-2">Profile</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/stream" ? (
                <Link
                  to="/stream"
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
                    <img src={liveLogo} className="nav-icon" alt="liveLogo" />
                    <p className="ml-2">Stream</p>
                  </div>
                </Link>
              ) : (
                <Link to="/stream" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img src={liveLogo} className="nav-icon" alt="liveLogo" />
                    <p className="ml-2">Stream</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/subscribers" ? (
                <Link
                  to="/subscribers"
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
                      src={subscribersLogo}
                      className="nav-icon"
                      alt="subscribersLogo"
                    />
                    <p className="ml-2">Subscribers</p>
                  </div>
                </Link>
              ) : (
                <Link to="/subscribers" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={subscribersLogo}
                      className="nav-icon"
                      alt="subscribersLogo"
                    />
                    <p className="ml-2">Subscribers</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/userSettings" ? (
                <Link
                  to="/userSettings"
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
                      src={settingsLogo}
                      className="nav-icon"
                      alt="settingsLogo"
                    />
                    <p className="ml-2">Settings</p>
                  </div>
                </Link>
              ) : (
                <Link to="/userSettings" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={settingsLogo}
                      className="nav-icon"
                      alt="settingsLogo"
                    />
                    <p className="ml-2">Settings</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/changePassword" ? (
                <Link
                  to="/changePassword"
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
                      src={changePasswordLogo}
                      className="nav-icon"
                      alt="passwordLogo"
                    />
                    <p className="ml-2">Change Password</p>
                  </div>
                </Link>
              ) : (
                <Link to="/changePassword" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={changePasswordLogo}
                      className="nav-icon"
                      alt="passwordLogo"
                    />
                    <p className="ml-2">Change Password</p>
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
