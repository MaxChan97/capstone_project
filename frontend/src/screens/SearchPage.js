import React, { useState, useEffect } from "react";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Tab } from "@material-ui/core";
import SearchCommunityResultList from "../components/SearchPage/SearchCommunityResultList";
import SearchPersonResultList from "../components/SearchPage/SearchPersonResultList";
import { useSelector } from "react-redux";

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
  const [personResults, setPersonResults] = useState([]);
  const [communityResults, setCommunityResults] = useState([]);

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
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [searchRefresh]);

  useEffect(() => {
    Api.searchCommunityByName(searchString)
      .done((communityObjects) => {
        setCommunityResults(communityObjects);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, [searchRefresh]);

  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTabView = (tabValue) => {
    if (tabValue === 0) {
      return <SearchPersonResultList personList={personResults} />;
    } else {
      return <SearchCommunityResultList communityList={communityResults} />;
    }
  };

  return (
    <div className="content-wrapper">
      <div style={{ paddingLeft: "2%", paddingTop: "1%" }}>
        <h3 style={{ fontWeight: "bold" }}>
          Results for '{displayedSearchString}'
        </h3>
      </div>
      <div style={{ marginBottom: "2%" }}>
        <StyledTabs value={tabValue} onChange={handleTabValueChange}>
          <StyledTab label="Channels" />
          <StyledTab label="Communities" />
        </StyledTabs>
      </div>
      <div style={{ width: "80%", margin: "auto" }}>
        {handleTabView(tabValue)}
      </div>
    </div>
  );
}
