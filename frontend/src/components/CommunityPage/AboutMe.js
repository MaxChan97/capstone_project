import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Api from "../../helpers/Api";
import Box from "@material-ui/core/Box";
import * as dayjs from "dayjs";
import { useAlert } from "react-alert";
import Button from "react-bootstrap/Button";
import EditDescription from "./EditDescription";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

function toTitleCase(str) {
  var i,
    frags = str.split("_");
  for (i = 0; i < frags.length; i++) {
    frags[i] =
      frags[i].charAt(0).toUpperCase() + frags[i].substr(1).toLowerCase();
  }
  return frags.join(" ");
}

export default function AboutMe({
  community,
  refresh,
  setRefresh,
  communityOwner,
}) {
  const classes = useStyles();
  const { communityId } = useParams();
  const alert = useAlert();

  const [edit, setEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [currentCommunity, setCurrentCommunity] = useState({});
  const [currentPerson, setCurrentPerson] = useState({});
  const [owner, setOwner] = useState({});
  const currentUser = useSelector((state) => state.currentUser);
  useEffect(() => {
    if (currentUser) {
      loadData(communityId);
    }
  }, [communityId]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  const handleEdit = () => {
    setEdit(true);
    setAnchorEl(null);
  };

  function loadData(communityId) {
    Api.getCommunityById(communityId, currentUser)
      .done((currentCommunity) => {
        console.log(currentCommunity);
        setCurrentCommunity(currentCommunity);
        setOwner(currentCommunity.owner);
      })
      .fail((xhr, status, error) => {
        alert.show("This community does not exist!");
      });
    Api.getPersonById(currentUser)
      .done((currentPerson) => {
        setCurrentPerson(currentPerson);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
  }

  return (
    <div className="container mt-3 ">
      <div className="row" style={{ textAlign: "left" }}>
        <div className="col-md-9">
          <div className="card card-primary mx-2 p-2">
            <div className="card-body">
              <Box fontWeight="600" fontSize={20}>
                About this Community
                {String(currentUser) === String(communityOwner.id) ? (
                  <Button
                    style={{
                      height: "35px",
                      width: "35px",
                      outline: "none",
                      marginBottom: "3px",
                      marginLeft: "-3px",
                    }}
                    variant="contained"
                    color="primary"
                    onClick={handleEdit}
                  >
                    <i
                      class="fas fa-pen"
                      style={{ height: "25px", width: "25px" }}
                    ></i>
                  </Button>
                ) : null}
              </Box>

              {currentCommunity.dateCreated !== undefined ? (
                <p className="font-weight-light">
                  Created{" "}
                  {dayjs(currentCommunity.dateCreated.slice(0, -5)).format(
                    "DD MMMM YYYY"
                  )}
                </p>
              ) : null}
              {edit === false ? (
                <p>{community.description}</p>
              ) : (
                <EditDescription
                  autofocus
                  data={community}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  setEdit={setEdit}
                ></EditDescription>
              )}

              <Box fontWeight="600" fontSize={20}>
                Related Topics
              </Box>
              <div component="ul" className={classes.root}>
                {currentCommunity.topicEnums !== undefined ? (
                  <div component="ul" className={classes.chip}>
                    {currentCommunity.topicEnums.map((topics, index) => (
                      <Chip
                        label={toTitleCase(topics)}
                        key={index}
                        style={{ backgroundColor: "#F1F3F8" }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
              <br />
              <Box fontWeight="600" fontSize={20}>
                Community Owner
              </Box>
              {owner.username !== undefined ? (
                <p className="font-weight-normal">@{owner.username}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
