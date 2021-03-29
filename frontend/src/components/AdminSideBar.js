import React from "react";
import { Link, useLocation } from "react-router-dom";
import liveLogo from "../assets/Live Logo.svg";
import followingLogo from "../assets/Following Logo.svg";
import likedLogo from "../assets/Liked Logo.svg";
import libraryLogo from "../assets/Library Logo.svg";
import communityLogo from "../assets/Community Logo.svg";
import categoriesLogo from "../assets/Categories Logo.svg";
import feedLogo from "../assets/Feed Logo.svg";
import subscribeLogo from "../assets/subscribeLogo.svg";
import inboxLogo from "../assets/inbox.svg";
import analyticsLogo from "../assets/analytics.svg";
import userManagementLogo from "../assets/UserManagement.svg";
import advertisementLogo from "../assets/advertise.svg";
import adminLogo from "../assets/admin.svg";

function AdminSidebar() {
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
              {location.pathname === "/admin/inbox" ? (
                <Link
                  to="/admin/inbox"
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
                    <img src={inboxLogo} className="nav-icon" alt="inboxLogo" />
                    <p className="ml-2">Inbox</p>
                  </div>
                </Link>
              ) : (
                <Link to="/admin/inbox" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img src={inboxLogo} className="nav-icon" alt="inboxLogo" />
                    <p className="ml-2">Inbox</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/admin/analytics" ? (
                <Link
                  to="/admin/analytics"
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
                    <img src={analyticsLogo} className="nav-icon" alt="analyticsLogo" />
                    <p className="ml-2">Analytics</p>
                  </div>
                </Link>
              ) : (
                <Link to="/admin/analytics" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img src={analyticsLogo} className="nav-icon" alt="analyticsLogo" />
                    <p className="ml-2">Analytics</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/admin/usermanagement" ? (
                <Link
                  to="/admin/usermanagement"
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
                    <img src={userManagementLogo} className="nav-icon" alt="userManagementLogo" />
                    <p className="ml-2">User Management</p>
                  </div>
                </Link>
              ) : (
                <Link to="/admin/usermanagement" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img src={userManagementLogo} className="nav-icon" alt="userManagementLogo" />
                    <p className="ml-2">User Management</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/admin/advertisementmanagement" ? (
                <Link
                  to="/admin/advertisementmanagement"
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
                    <img src={advertisementLogo} className="nav-icon" alt="advertisementLogo" />
                    <p className="ml-2">Ad Management</p>
                  </div>
                </Link>
              ) : (
                <Link to="/admin/advertisementmanagement" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img src={advertisementLogo} className="nav-icon" alt="advertisementLogo" />
                    <p className="ml-2">Ad Management</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="nav-item">
              {location.pathname === "/admin/adminmanagement" ? (
                <Link
                  to="/admin/adminmanagement"
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
                    <img src={adminLogo} className="nav-icon" alt="adminLogo" />
                    <p className="ml-2">Admin Management</p>
                  </div>
                </Link>
              ) : (
                <Link to="/admin/adminmanagement" className="nav-link">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <img src={adminLogo} className="nav-icon" alt="adminLogo" />
                    <p className="ml-2">Admin Management</p>
                  </div>
                </Link>
              )}
            </li>
            {/*
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
                  */}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
export default AdminSidebar;
