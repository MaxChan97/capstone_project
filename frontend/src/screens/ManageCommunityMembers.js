import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector } from "react-redux";
import Api from "../helpers/Api";
import Box from "@material-ui/core/Box";
import SearchMembersBar from "../components/CommunityPage/SearchMembersBar";
import ManageMembersList from "../components/CommunityPage/ManageMembersList";

export default function ManageCommunityMembers() {
  const currentUser = useSelector((state) => state.currentUser);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const alert = useAlert();
  const { communityId } = useParams();

  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData(communityId);
    }
  }, [communityId, refresh]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function loadData(communityId) {
    Api.getCommunityMembers(communityId)
      .done((communityMembers) => {
        setCommunityMembers(communityMembers);
        console.log(communityMembers);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-9 ml-4 mt-4" style={{ textAlign: "left" }}>
          <div className="card card-primary">
            <div className="container">
              <div className="row">
                <Box fontWeight="fontWeightBold" fontSize={22} ml={5} mt={4}>
                  Search Members
                </Box>
              </div>
              <div className="row">
                <div className="col-md-4 ml-4" style={{ textAlign: "left" }}>
                  <SearchMembersBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-5 mt-4" style={{ textAlign: "left" }}>
                  {communityMembers !== undefined ? (
                    <ManageMembersList
                      communityMembers={communityMembers}
                      searchTerm={searchTerm}
                      refresh ={refresh}
                      setRefresh ={setRefresh}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
