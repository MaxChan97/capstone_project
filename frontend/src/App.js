import React, { useState } from "react";
import "./App.css";
import { Route, useLocation } from "react-router-dom";
import { Switch } from "react-router";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LivePage from "./screens/LivePage";
import RecommendedLivePage from "./screens/RecommendedLivePage";
import TrendingLivePage from "./screens/TrendingLivePage";
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
import StreamPage from "./screens/StreamPage";
import ViewStreamPage from "./screens/ViewStreamPage";
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
import TrendsPage from "./screens/TrendsPage";
import ManageCommunityMembers from "./screens/ManageCommunityMembers";
import ViewCommunityMembers from "./screens/ViewCommunityMembers";
import CommunityFeed from "./screens/CommunityFeed";
import CommunityDashboardSidebar from "./components/CommunityDashboardSidebar";
import BannedPage from "./screens/BannedPage";
import UserAnalytics from "./screens/UserAnalytics";
import AdminSideBar from "./components/AdminSideBar";
import AdminInboxPage from "./screens/AdminInboxPage";
import AdminAnalyticsPage from "./screens/AdminAnalyticsPage";
import AdminUserManagementPage from "./screens/AdminUserManagementPage";
import AdminAdManagementPage from "./screens/AdminAdManagementPage";
import AdminManagementPage from "./screens/AdminManagementPage";
import AdminLogin from "./screens/AdminLogin";
import CreateAnotherAdmin from "./screens/CreateAnotherAdmin";
import PointsPage from "./screens/PointsPage";

import { useSelector } from "react-redux";
import AdminNavBar from "./components/AdminNavBar";
import ReportDetails from "./components/AdminPage/ReportDetails";
import AdminLog from "./components/AdminPage/AdminLog";
import AllAdminLogs from "./components/AdminPage/AllAdminLogs";
import BannedFromLoginPage from "./screens/BannedFromLoginPage";
import AdminDeactivatedPage from "./screens/AdminDeactivatedPage";
import VideoPage from "./screens/VideoPage";
import VideosPage from "./screens/VideosPage";
import RecommendedVideosPage from "./screens/RecommendedVideosPage";
import TrendingVideosPage from "./screens/TrendingVideosPage";

import Payment from "./screens/PaymentPage";
import PaymentSuccess from "./screens/PaymentSuccessPage";
// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentSuccessPage from "./screens/PaymentSuccessPage";
import AdminCommentCard from "./components/ProfilePage/AdminCommentCard";
import AdminReplyCard from "./components/ProfilePage/AdminReplyCard";
import CommunityDeletedPage from "./screens/CommunityDeletedPage";
import AdminSystemWideNotif from "./screens/AdminSystemWideNotif";
import CreateAd from "./components/AdminPage/CreateAd";
import AdvertDetails from "./components/AdminPage/AdvertDetails";
const stripePromise = loadStripe(
  "pk_test_51IU3CaHobA4nRrQlSkBDrr0y3D0xRnk6Wts0oyQmd7hk8BihJImI4azJ0MaQ1CtcNsrUBtwO6K5TKfMaprYUhvUl006GWy5vFQ"
);

function App() {
  let location = useLocation();
  const isAdmin = useSelector((state) => state.isAdmin);

  const [searchString, setSearchString] = useState("");
  const [searchRefresh, setSearchRefresh] = useState(true);

  function renderNavSide() {
    if (
      location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/admin/login" ||
      location.pathname === "/banned" ||
      location.pathname === "/admin/deactivated"
    ) {
      return "";
    } else if (isAdmin == true) {
      return (
        <div>
          <AdminNavBar
            searchString={searchString}
            setSearchString={setSearchString}
            searchRefresh={searchRefresh}
            setSearchRefresh={setSearchRefresh}
          />
          <AdminSideBar />
        </div>
      );
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
      location.pathname === "/userSettings" ||
      location.pathname === "/changePassword" ||
      location.pathname === "/stream" ||
      location.pathname === "/userAnalytics"
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
    } else if (
      location.pathname.split("/")[location.pathname.split("/").length - 1] ===
        "manageDetails" ||
      location.pathname.split("/")[location.pathname.split("/").length - 1] ===
        "manageMembers"
    ) {
      return (
        <div>
          <Navbar
            searchString={searchString}
            setSearchString={setSearchString}
            searchRefresh={searchRefresh}
            setSearchRefresh={setSearchRefresh}
          />
          <CommunityDashboardSidebar />
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
      <Elements stripe={stripePromise}>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/admin/login" component={AdminLogin} />
          <Route exact path="/newPassword/:resetId" component={NewPassword} />
          <Route exact path="/resetPassword" component={ResetPassword} />
          <div className="layout-navbar-fixed">
            <div className="wrapper">
              {renderNavSide()}
              <Route exact path="/" component={LivePage} />
              <Route
                exact
                path="/live/recommended"
                component={RecommendedLivePage}
              />
              <Route exact path="/live/trending" component={TrendingLivePage} />
              <Route exact path="/following" component={FollowingPage} />
              <Route exact path="/subscribing" component={SubscribingPage} />
              <Route
                exact
                path="/community/:communityId"
                component={CommunityPage}
              />
              <Route exact path="/feed" component={FeedPage} />
              <Route exact path="/profile/:personId" component={ProfilePage} />
              <Route exact path="/postCard" component={ProfilePostCard} />
              <Route exact path="/aboutMe" component={AboutMe} />
              <Route exact path="/userSettings" component={UserSettings} />
              <Route exact path="/stream" component={StreamPage} />
              <Route
                exact
                path="/stream/:streamId"
                component={ViewStreamPage}
              />
              <Route exact path="/chat/:personId" component={ChatPage} />
              <Route exact path="/video/:videoId" component={VideoPage} />
              <Route exact path="/videos" component={VideosPage} />
              <Route
                exact
                path="/videos/recommended"
                component={RecommendedVideosPage}
              />
              <Route
                exact
                path="/videos/trending"
                component={TrendingVideosPage}
              />
              <Route
                exact
                path="/createCommunity"
                component={CreateCommunity}
              />
              <Route exact path="/changePassword" component={ChangePassword} />
              <Route exact path="/myCommunities" component={MyCommunities} />
              <Route exact path="/userAnalytics" component={UserAnalytics} />
              <Route exact path="/PointsPage" component={PointsPage} />
              <Route
                exact
                path="/community/:communityId/banned"
                component={BannedPage}
              />

              <Route
                exact
                path="/community/:communityId/manageDetails"
                component={ManageCommunityDetails}
              />
              <Route
                exact
                path="/community/:communityId/manageMembers"
                component={ManageCommunityMembers}
              />
              <Route
                exact
                path="/community/:communityId/viewMembers"
                component={ViewCommunityMembers}
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
              <Route
                exact
                path="/trend/:hashtag"
                render={() => <TrendsPage />}
              />
              <Route exact path="/community" component={CommunityFeed} />
              <Route
                exact
                path="/payment/:anotherPersonId"
                component={Payment}
              />
              <Route exact path="/paymentSuccess" component={PaymentSuccess} />

              <Route exact path="/admin/inbox" component={AdminInboxPage} />
              <Route
                exact
                path="/admin/analytics"
                component={AdminAnalyticsPage}
              />
              <Route
                exact
                path="/admin/usermanagement"
                component={AdminUserManagementPage}
              />
              <Route
                exact
                path="/admin/advertisementmanagement"
                component={AdminAdManagementPage}
              />
              <Route
                exact
                path="/admin/adminmanagement"
                component={AdminManagementPage}
              />
              <Route
                exact
                path="/admin/createAdmin"
                component={CreateAnotherAdmin}
              />
              <Route
                exact
                path="/admin/reportDetails/:reportId"
                component={ReportDetails}
              />

              <Route exact path="/admin/log/:adminId" component={AdminLog} />

              <Route exact path="/admin/logs" component={AllAdminLogs} />
              <Route exact path="/banned" component={BannedFromLoginPage} />
              <Route
                exact
                path="/admin/deactivated"
                component={AdminDeactivatedPage}
              />
              <Route
                exact
                path="/comment/:commentId"
                component={AdminCommentCard}
              />
              <Route exact path="/reply/:replyId" component={AdminReplyCard} />
              <Route
                exact
                path="/deleted/community"
                component={CommunityDeletedPage}
              />
              <Route
                exact
                path="/admin/systemNotif"
                component={AdminSystemWideNotif}
              />
              <Route exact path="/admin/createAd" component={CreateAd} />
              <Route
                exact
                path="/admin/advertDetails/:advertId"
                component={AdvertDetails}
              />
              {/*<Route component={PageNotFound} />*/}
            </div>
          </div>
        </Switch>
      </Elements>
    </div>
  );
}

export default App;
