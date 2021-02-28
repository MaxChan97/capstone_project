import React from "react";
import "./App.css";
import { Switch, Route, useLocation } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LivePage from "./screens/LivePage";
import FollowingPage from "./screens/FollowingPage";
import LikedPage from "./screens/LikedPage";
import LibraryPage from "./screens/LibraryPage";
import CommunityPage from "./screens/CommunityPage";
import CategoriesPage from "./screens/CategoriesPage";
import FeedPage from "./screens/FeedPage";
import ProfilePage from "./screens/ProfilePage";
import ProfilePostCard from "./components/ProfilePage/ProfilePostCard";
import AboutMe from "./components/ProfilePage/AboutMe";
import UserSettings from "./screens/UserSettings";
import ChatPage from "./screens/ChatPage";
import CustomiseProfile from "./screens/CustomiseProfile";
import SubscribersPage from "./screens/SubscribersPage";
import ProfilePostWithComments from "./components/ProfilePage/ProfilePostWithComments";
import CreateCommunity from "./screens/CreateCommunityPage";

function App() {
  let location = useLocation();

  function renderNavSide() {
    if (location.pathname === "/login" || location.pathname === "/register") {
      return "";
    } else if (location.pathname === "/chat") {
      return (
        <div>
          <Navbar />
        </div>
      );
    } else {
      return (
        <div>
          <Navbar />
          <Sidebar />
        </div>
      );
    }
  }

  return (
    <div className="App">
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <div className="layout-navbar-fixed">
          <div className="wrapper">
            {renderNavSide()}
            <Route exact path="/" component={LivePage} />
            <Route exact path="/following" component={FollowingPage} />
            <Route exact path="/liked" component={LikedPage} />
            <Route exact path="/library" component={LibraryPage} />
            <Route
              exact
              path="/community/:communityId"
              component={CommunityPage}
            />
            <Route exact path="/categories" component={CategoriesPage} />
            <Route exact path="/feed" component={FeedPage} />
            <Route exact path="/profile/:personId" component={ProfilePage} />
            <Route exact path="/postCard" component={ProfilePostCard} />
            <Route exact path="/aboutMe" component={AboutMe} />
            <Route exact path="/userSettings" component={UserSettings} />
            <Route exact path="/chat/:personId" component={ChatPage} />
            <Route exact path="/createCommunity" component={CreateCommunity} />
            <Route
              exact
              path="/customiseProfile"
              component={CustomiseProfile}
            />
            <Route exact path="/subscribers" component={SubscribersPage} />
            <Route
              exact
              path="/post/:postId"
              component={ProfilePostWithComments}
            />
          </div>
        </div>
      </Switch>
    </div>
  );
}

export default App;
