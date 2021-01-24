import React, { useEffect } from "react";
import "./App.css";
import { Switch, Route, useLocation } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LandingPage from "./screens/LandingPage";
import LivePage from "./screens/LivePage";
import FollowingPage from "./screens/FollowingPage";
import LikedPage from "./screens/LikedPage";
import LibraryPage from "./screens/LandingPage";
import CommunityPage from "./screens/CommunityPage";
import CategoriesPage from "./screens/CategoriesPage";
import FeedPage from "./screens/FeedPage";

function App() {
  let location = useLocation();

  return (
    <div className="App">
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <div className="wrapper">
          {location.pathname !== "/login" &&
          location.pathname !== "/register" ? (
            <div>
              <Navbar />
              <Sidebar />
            </div>
          ) : (
            ""
          )}
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/live" component={LivePage} />
          <Route exact path="/following" component={FollowingPage} />
          <Route exact path="/liked" component={LikedPage} />
          <Route exact path="/library" component={LibraryPage} />
          <Route exact path="/community" component={CommunityPage} />
          <Route exact path="/categories" component={CategoriesPage} />
          <Route exact path="/feed" component={FeedPage} />
        </div>
      </Switch>
    </div>
  );
}

export default App;
