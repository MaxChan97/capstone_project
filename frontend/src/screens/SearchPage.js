import React, { useState, useEffect } from "react";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Tab } from "@material-ui/core";
import SearchCommunityResultList from "../components/SearchPage/SearchCommunityResultList";
import SearchPersonResultList from "../components/SearchPage/SearchPersonResultList";
import SearchPostResultList from "../components/SearchPage/SearchPostResultList";
import LiveStreamCard from "../components/LivePage/LiveStreamCard";
import VideoCard from "../components/VideosPage/VideoCard";
import { useSelector } from "react-redux";
import { animateScroll } from "react-scroll";
import TrendsCard from "../components/FeedPage/TrendsCard";
import TopContributorCard from "../components/FeedPage/TopContributorCard";
import TopStreamerCard from "../components/FeedPage/TopStreamerCard";

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#4A5056",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginLeft: theme.spacing(1),
    "&:focus": {
      opacity: 1,
      color: "#3B21CB",
      outline: "none",
    },
  },
}))((props) => <Tab disableRipple {...props} />);

export default function SearchPage({ searchString, searchRefresh }) {
  const alert = useAlert();

  const [displayedSearchString, setDisplayedSearchString] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [perPage] = useState(5);

  // For pagination
  const [personOffset, setPersonOffset] = useState(1);
  const [personResults, setPersonResults] = useState([]);
  const [personPaginatedResults, setPersonPaginatedResults] = useState([]);
  const [personPageCount, setPersonPageCount] = useState(0);

  const [communityOffset, setCommunityOffset] = useState(1);
  const [communityResults, setCommunityResults] = useState([]);
  const [communityPaginatedResults, setCommunityPaginatedResults] = useState(
    []
  );
  const [communityPageCount, setCommunityPageCount] = useState(0);

  const [postOffset, setPostOffset] = useState(1);
  const [postResults, setPostResults] = useState([]);
  const [postPaginatedResults, setPostPaginatedResults] = useState([]);
  const [postPageCount, setPostPageCount] = useState(0);
  const [postRefresh, setPostRefresh] = useState(true);

  const [streamOffset, setStreamOffset] = useState(1);
  const [streamResults, setStreamResults] = useState([]);
  const [streamPaginatedResults, setStreamPaginatedResults] = useState([]);
  const [streamPageCount, setStreamPageCount] = useState(0);

  const [topTenContributors, setTopTenContributors] = useState([]);
  const [topTenStreamers, setTopTenStreamers] = useState([]);
  const [topTrends, setTopTrends] = useState([]);
  const [todaysTrends, setTodaysTrends] = useState([]);

  const [videoOffset, setVideoOffset] = useState(1);
  const [videoResults, setVideoResults] = useState([]);
  const [videoPaginatedResults, setVideoPaginatedResults] = useState([]);
  const [videoPageCount, setVideoPageCount] = useState(0);

  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    setDisplayedSearchString(searchString);
  }, [searchRefresh]);

  useEffect(() => {
    Api.searchPersonByUsername(searchString)
      .done((personObjects) => {
        const filteredPersonObjects = personObjects.filter(
          (person) => person.id != currentUser
        );
        setPersonResults(filteredPersonObjects);
        setPersonPageCount(Math.ceil(filteredPersonObjects.length / perPage));
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [searchRefresh]);

  useEffect(() => {
    const slice = personResults.slice(
      (personOffset - 1) * perPage,
      (personOffset - 1) * perPage + perPage
    );
    setPersonPaginatedResults(slice);
  }, [personOffset, personResults]);

  useEffect(() => {
    Api.searchCommunityByName(searchString)
      .done((communityObjects) => {
        setCommunityResults(communityObjects);
        setCommunityPageCount(Math.ceil(communityObjects.length / perPage));
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [searchRefresh]);

  useEffect(() => {
    const slice = communityResults.slice(
      (communityOffset - 1) * perPage,
      (communityOffset - 1) * perPage + perPage
    );
    setCommunityPaginatedResults(slice);
  }, [communityOffset, communityResults]);

  useEffect(() => {
    Api.searchPostByBody(searchString)
      .done((postObjects) => {
        setPostResults(postObjects.reverse());
        setPostPageCount(Math.ceil(postObjects.length / perPage));
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [searchRefresh, postRefresh]);

  useEffect(() => {
    scrollToTopOfResultList();
  }, [
    personPaginatedResults,
    communityPaginatedResults,
    postPaginatedResults,
    streamPaginatedResults,
  ]);

  useEffect(() => {
    const slice = postResults.slice(
      (postOffset - 1) * perPage,
      (postOffset - 1) * perPage + perPage
    );
    setPostPaginatedResults(slice);
  }, [postOffset, postResults]);

  useEffect(() => {
    Api.searchStreamByTitleAndDescription(searchString)
      .done((streamObjects) => {
        (async () => {
          for (var i = streamObjects.length - 1; i >= 0; i--) {
            if (streamObjects[i].isPaid === true) {
              // check if current user is subscribed
              let subscriptionStatus = await Api.isSubscribed(
                currentUser,
                streamObjects[i].streamer.id
              );
              if (subscriptionStatus.subscriptionStatus === "NotSubscribed") {
                streamObjects.splice(i, 1);
              }
            }
          }

          setStreamResults(streamObjects.reverse());
          setStreamPageCount(Math.ceil(streamObjects.length / 16));
        })();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [searchRefresh]);

  useEffect(() => {
    const slice = streamResults.slice(
      (streamOffset - 1) * 16,
      (streamOffset - 1) * 16 + 16
    );
    setStreamPaginatedResults(slice);
  }, [streamOffset, streamResults]);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  function loadData() {
    Api.getTopTenContributors()
      .done((topTenContributors) => {
        setTopTenContributors(topTenContributors);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
    Api.getTopTenStreamers()
      .done((topTenStreamers) => {
        setTopTenStreamers(topTenStreamers);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
    Api.getTopTrends()
      .done((topAllTime) => {
        setTopTrends(topAllTime);
      })
      .fail((xhr, status, error) => {
        alert("Error");
      });
    Api.getTodaysTrends()
      .done((topToday) => {
        console.log(topToday);
        setTodaysTrends(topToday);
      })
      .fail((xhr, status, error) => {
        alert("Error");
      });
  }
  useEffect(() => {
    Api.searchVideoByTitleAndDescription(searchString)
      .done((videoObjects) => {
        (async () => {
          for (var i = videoObjects.length - 1; i >= 0; i--) {
            if (videoObjects[i].isPaid === true) {
              let subscriptionStatus = await Api.isSubscribed(
                currentUser,
                videoObjects[i].author.id
              );
              if (
                subscriptionStatus.subscriptionStatus === "NotSubscribed" &&
                videoObjects[i].author.id !== currentUser
              ) {
                videoObjects.splice(i, 1);
              }
            }
          }

          setVideoResults(videoObjects.reverse());
          setVideoPageCount(Math.ceil(videoObjects.length / 16));
        })();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [searchRefresh]);

  useEffect(() => {
    const slice = videoResults.slice(
      (videoOffset - 1) * 16,
      (videoOffset - 1) * 16 + 16
    );
    setVideoPaginatedResults(slice);
  }, [videoOffset, videoResults]);

  const handlePersonPageClick = (e) => {
    const selectedPage = e.selected;
    setPersonOffset(selectedPage + 1);
  };

  const handleCommunityPageClick = (e) => {
    const selectedPage = e.selected;
    setCommunityOffset(selectedPage + 1);
  };

  const handlePostPageClick = (e) => {
    const selectedPage = e.selected;
    setPostOffset(selectedPage + 1);
  };

  const handleStreamPageClick = (e) => {
    const selectedPage = e.selected;
    setStreamOffset(selectedPage + 1);
  };

  const handleVideoPageClick = (e) => {
    const selectedPage = e.selected;
    setVideoOffset(selectedPage + 1);
  };

  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTabView = (tabValue) => {
    if (tabValue === 0) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-8">
              <SearchPersonResultList
                personList={personPaginatedResults}
                personPageCount={personPageCount}
                handlePersonPageClick={handlePersonPageClick}
              />
            </div>

            <div className="col-4">
              <TopStreamerCard data={topTenStreamers} />
              <TopContributorCard data={topTenContributors} />
              <TrendsCard topTrends={topTrends} todaysTrends={todaysTrends} />
            </div>
          </div>
        </div>
      );
    } else if (tabValue === 1) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-8">
              <SearchCommunityResultList
                communityList={communityPaginatedResults}
                communityPageCount={communityPageCount}
                handleCommunityPageClick={handleCommunityPageClick}
              />
            </div>
            <div className="col-4">
              <TopStreamerCard data={topTenStreamers} />
              <TopContributorCard data={topTenContributors} />
              <TrendsCard topTrends={topTrends} todaysTrends={todaysTrends} />
            </div>
          </div>
        </div>
      );
    } else if (tabValue === 2) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-8">
              <SearchPostResultList
                postList={postPaginatedResults}
                postPageCount={postPageCount}
                handlePostPageClick={handlePostPageClick}
                postRefresh={postRefresh}
                setPostRefresh={setPostRefresh}
              />
            </div>
            <div className="col-4">
              <TopStreamerCard data={topTenStreamers} />
              <TopContributorCard data={topTenContributors} />
              <TrendsCard topTrends={topTrends} todaysTrends={todaysTrends} />
            </div>
          </div>
        </div>
      );
    } else if (tabValue === 3) {
      return (
        <LiveStreamCard
          streamList={streamPaginatedResults}
          streamPageCount={streamPageCount}
          handleStreamPageClick={handleStreamPageClick}
        />
      );
    } else if (tabValue === 4) {
      return (
        <VideoCard
          videoList={videoPaginatedResults}
          videoPageCount={videoPageCount}
          handleVideoPageClick={handleVideoPageClick}
        />
      );
    }
  };

  function scrollToTopOfResultList() {
    animateScroll.scrollToTop();
  }

  return (
    <div className="content-wrapper">
      <div style={{ paddingLeft: "2%", paddingTop: "1%" }}>
        <h3 style={{ fontWeight: "bold" }}>
          Results for '{displayedSearchString}'
        </h3>
      </div>
      <div style={{ marginBottom: "2%" }}>
        <StyledTabs value={tabValue} onChange={handleTabValueChange}>
          <StyledTab label="Users" />
          <StyledTab label="Communities" />
          <StyledTab label="Posts" />
          <StyledTab label="Streams" />
          <StyledTab label="Videos" />
        </StyledTabs>
      </div>
      {tabValue === 3 || tabValue === 4 ? (
        <div style={{ paddingLeft: "28px", paddingRight: "28px" }}>
          {handleTabView(tabValue)}
        </div>
      ) : (
        <div style={{ width: "80%", margin: "auto" }}>
          {handleTabView(tabValue)}
        </div>
      )}
    </div>
  );
}
