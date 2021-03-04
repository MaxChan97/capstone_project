import React, { useState } from "react";
import "./App.css";
import { Switch, Route, useLocation } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LivePage from "./screens/LivePage";
import FollowingPage from "./screens/FollowingPage";
import SubscribingPage from "./screens/SubscribingPage";
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
import ManageCommunityDetails from "./screens/ManageCommunityDetails";
import ResetPassword from "./screens/ResetPassword";
import ChannelDashboardSidebar from "./components/ChannelDashboardSidebar";
import ChangePassword from "./screens/ChangePassword";
import NewPassword from "./screens/NewPassword";
import MyCommunities from "./screens/MyCommunitiesPage";
import CommunityPostWithComments from "./components/CommunityPage/CommunityPostWithComments";
import SearchPage from "./screens/SearchPage";

function App() {
  let location = useLocation();

  const [searchString, setSearchString] = useState("");
  const [searchRefresh, setSearchRefresh] = useState(true);

  function renderNavSide() {
    if (location.pathname === "/login" || location.pathname === "/register") {
      return "";
    } else if (location.pathname === "/chat") {
      return (
        <div>
          <Navbar
            searchString={searchString}
            setSearchString={setSearchString}
            searchRefresh={searchRefresh}
            setSearchRefresh={setSearchRefresh}
          />
        </div>
      );
    } else if (
      location.pathname === "/customiseProfile" ||
      location.pathname === "/subscribers" ||
      location.pathname === "/userSettings"
    ) {
      return (
        <div>
          <Navbar
            searchString={searchString}
            setSearchString={setSearchString}
            searchRefresh={searchRefresh}
            setSearchRefresh={setSearchRefresh}
          />
          <ChannelDashboardSidebar />
        </div>
      );
    } else {
      return (
        <div>
          <Navbar
            searchString={searchString}
            setSearchString={setSearchString}
            searchRefresh={searchRefresh}
            setSearchRefresh={setSearchRefresh}
          />
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
        <Route exact path="/newPassword/:resetId" component={NewPassword} />
        <Route exact path="/resetPassword" component={ResetPassword} />
        <div className="layout-navbar-fixed">
          <div className="wrapper">
            {renderNavSide()}
            <Route exact path="/" component={LivePage} />
            <Route exact path="/following" component={FollowingPage} />
            <Route exact path="/subscribing" component={SubscribingPage} />
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
            <Route exact path="/changePassword" component={ChangePassword} />
            <Route exact path="/myCommunities" component={MyCommunities} />

            <Route
              exact
              path="/community/:communityId/manageDetails"
              component={ManageCommunityDetails}
            />
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
            <Route
              exact
              path="/community/post/:postId"
              component={CommunityPostWithComments}
            />
            <Route
              exact
              path="/search"
              render={() => (
                <SearchPage
                  searchString={searchString}
                  searchRefresh={searchRefresh}
                />
              )}
            />
          </div>
        </div>
      </Switch>
    </div>
  );
}

export default App;
