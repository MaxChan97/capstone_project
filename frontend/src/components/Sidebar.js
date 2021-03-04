import React from "react";
import { Link, useLocation } from "react-router-dom";
import liveLogo from "../assets/Live Logo.svg";
import followingLogo from "../assets/Following Logo.svg";
import likedLogo from "../assets/Liked Logo.svg";
import libraryLogo from "../assets/Library Logo.svg";
import communityLogo from "../assets/Community Logo.svg";
import categoriesLogo from "../assets/Categories Logo.svg";
import feedLogo from "../assets/Feed Logo.svg";

function Sidebar() {
  let location = useLocation();

  return (
    <aside className="main-sidebar sidebar-light-primary elevation-1">
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
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
                    <p className="ml-2">Live</p>
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
                    <p className="ml-2">Live</p>
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
                      src={followingLogo}
                      className="nav-icon"
                      alt="followingLogo"
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
                      src={followingLogo}
                      className="nav-icon"
                      alt="followingLogo"
                    />
                    <p className="ml-2">Subscribing</p>
                  </div>
                </Link>
              )}
            </li>

            <li className="nav-item">
              {location.pathname === "/liked" ? (
                <Link
                  to="/liked"
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
                    <img src={likedLogo} className="nav-icon" alt="likedLogo" />
                    <p className="ml-2">Liked</p>
                  </div>
                </Link>
              ) : (
                <Link to="/liked" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img src={likedLogo} className="nav-icon" alt="likedLogo" />
                    <p className="ml-2">Liked</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/library" ? (
                <Link
                  to="/library"
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
                      src={libraryLogo}
                      className="nav-icon"
                      alt="libraryLogo"
                    />
                    <p className="ml-2">Library</p>
                  </div>
                </Link>
              ) : (
                <Link to="/library" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={libraryLogo}
                      className="nav-icon"
                      alt="libraryLogo"
                    />
                    <p className="ml-2">Library</p>
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
              {location.pathname === "/categories" ? (
                <Link
                  to="/categories"
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
                      src={categoriesLogo}
                      className="nav-icon"
                      alt="categoriesLogo"
                    />
                    <p className="ml-2">Categories</p>
                  </div>
                </Link>
              ) : (
                <Link to="/categories" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={categoriesLogo}
                      className="nav-icon"
                      alt="categoriesLogo"
                    />
                    <p className="ml-2">Categories</p>
                  </div>
                </Link>
              )}
            </li>
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
          </ul>
        </nav>
      </div>
    </aside>
  );
}
export default Sidebar;
