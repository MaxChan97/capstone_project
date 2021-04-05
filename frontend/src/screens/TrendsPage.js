import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";
import { animateScroll } from "react-scroll";
import { useParams } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Tab } from "@material-ui/core";
import SearchCommunityResultList from "../components/SearchPage/SearchCommunityResultList";
import SearchPersonResultList from "../components/SearchPage/SearchPersonResultList";
import SearchPostResultList from "../components/SearchPage/SearchPostResultList";
import Api from "../helpers/Api";

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

export default function TrendsPage() {
  const alert = useAlert();
  const { hashtag } = useParams();
  console.log(hashtag);

  const [tabValue, setTabValue] = useState(0);
  const [perPage] = useState(5);

  const [postOffset, setPostOffset] = useState(1);
  const [postResults, setPostResults] = useState([]);
  const [postPaginatedResults, setPostPaginatedResults] = useState([]);
  const [postPageCount, setPostPageCount] = useState(0);
  const [postRefresh, setPostRefresh] = useState(true);

  useEffect(() => {
    Api.searchPostByBody(hashtag)
      .done((postObjects) => {
        setPostResults(postObjects.reverse());
        setPostPageCount(Math.ceil(postObjects.length / perPage));
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [postRefresh]);

  useEffect(() => {
    scrollToTopOfResultList();
  }, [postPaginatedResults]);

  useEffect(() => {
    const slice = postResults.slice(
      (postOffset - 1) * perPage,
      (postOffset - 1) * perPage + perPage
    );
    setPostPaginatedResults(slice);
  }, [postOffset, postResults]);

  const handlePostPageClick = (e) => {
    const selectedPage = e.selected;
    setPostOffset(selectedPage + 1);
  };

  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTabView = (tabValue) => {
    if (tabValue === 0) {
      return (
        <SearchPostResultList
          postList={postPaginatedResults}
          postPageCount={postPageCount}
          handlePostPageClick={handlePostPageClick}
          postRefresh={postRefresh}
          setPostRefresh={setPostRefresh}
        />
      );
    } else if (tabValue === 1) {
      return (
        <SearchPostResultList
          postList={postPaginatedResults}
          postPageCount={postPageCount}
          handlePostPageClick={handlePostPageClick}
          postRefresh={postRefresh}
          setPostRefresh={setPostRefresh}
        />
      );
    } else {
      return (
        <SearchPostResultList
          postList={postPaginatedResults}
          postPageCount={postPageCount}
          handlePostPageClick={handlePostPageClick}
          postRefresh={postRefresh}
          setPostRefresh={setPostRefresh}
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
        <h3 style={{ fontWeight: "bold" }}>{hashtag}</h3>
      </div>
      <div style={{ marginBottom: "2%" }}>
        <StyledTabs value={tabValue} onChange={handleTabValueChange}>
          <StyledTab label="Posts" />
          <StyledTab label="Streams" />
          <StyledTab label="Videos" />
        </StyledTabs>
      </div>
      <div style={{ width: "80%", margin: "auto" }}>
        {handleTabView(tabValue)}
      </div>
    </div>
  );
}
