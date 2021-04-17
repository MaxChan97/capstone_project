import React from "react";
import { Link, useLocation } from "react-router-dom";
import liveLogo from "../assets/Live Logo.svg";
import videosLogo from "../assets/Videos Logo.svg";
import likedLogo from "../assets/Liked Logo.svg";
import libraryLogo from "../assets/Library Logo.svg";
import communityLogo from "../assets/Community Logo.svg";
import categoriesLogo from "../assets/Categories Logo.svg";
import feedLogo from "../assets/Feed Logo.svg";
import followingLogo from "../assets/Following Logo.svg";
import subscribeLogo from "../assets/subscribeLogo.svg";
import BarChartIcon from "@material-ui/icons/BarChart";
import BNBLogo from "../assets/BNB Logo.png";
import ReportSystem from "./ReportSystem";

function Sidebar() {
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

      <div className="sidebar">
        <nav>
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              {location.pathname === "/feed" ? (
                <Link
                  to="/feed"
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
                    <img src={feedLogo} className="nav-icon" alt="feedLogo" />
                    <p className="ml-2">Feed</p>
                  </div>
                </Link>
              ) : (
                <Link to="/feed" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img src={feedLogo} className="nav-icon" alt="feedLogo" />
                    <p className="ml-2">Feed</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/" ? (
                <Link
                  to="/"
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
                    <p className="ml-2">Streams</p>
                  </div>
                </Link>
              ) : (
                <Link to="/" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img src={liveLogo} className="nav-icon" alt="liveLogo" />
                    <p className="ml-2">Streams</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/videos" ? (
                <Link
                  to="/videos"
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
                    <img src={videosLogo} className="nav-icon" alt="liveLogo" />
                    <p className="ml-2">Videos</p>
                  </div>
                </Link>
              ) : (
                <Link to="/videos" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img src={videosLogo} className="nav-icon" alt="liveLogo" />
                    <p className="ml-2">Videos</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/following" ? (
                <Link
                  to="/following"
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
                      src={followingLogo}
                      className="nav-icon"
                      alt="followingLogo"
                    />
                    <p className="ml-2">Following</p>
                  </div>
                </Link>
              ) : (
                <Link to="/following" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={followingLogo}
                      className="nav-icon"
                      alt="followingLogo"
                    />
                    <p className="ml-2">Following</p>
                  </div>
                </Link>
              )}
            </li>

            <li className="nav-item">
              {location.pathname === "/subscribing" ? (
                <Link
                  to="/subscribing"
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
                      src={subscribeLogo}
                      className="nav-icon"
                      alt="subscribeLogo"
                    />
                    <p className="ml-2">Subscribing</p>
                  </div>
                </Link>
              ) : (
                <Link to="/subscribing" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={subscribeLogo}
                      className="nav-icon"
                      alt="subscribeLogo"
                    />
                    <p className="ml-2">Subscribing</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/community" ? (
                <Link
                  to="/community"
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
                      src={communityLogo}
                      className="nav-icon"
                      alt="communityLogo"
                    />
                    <p className="ml-2">Community</p>
                  </div>
                </Link>
              ) : (
                <Link to="/community" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={communityLogo}
                      className="nav-icon"
                      alt="communityLogo"
                    />
                    <p className="ml-2">Community</p>
                  </div>
                </Link>
              )}
            </li>

            <li className="nav-item">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <ReportSystem></ReportSystem>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
export default Sidebar;
