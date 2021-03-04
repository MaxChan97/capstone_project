import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Api from "../../../helpers/Api";
import SearchCard from "./SearchCard"
import VideosCard from "./VideosCard"



const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
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

export default function VideosTab() {
    const classes = useStyles();

    // const [currentPerson, setCurrentPerson] = useState({});

    const [videoList, setVideoList] = useState([]);
    const [searchTerm, setSearchTerm] = useState([]);
    const currentUser = useSelector((state) => state.currentUser);

    useEffect(() => {
        if (currentUser) {
            loadData(currentUser);
            console.log(currentUser);
        }
    }, [currentUser]);

    if (currentUser === null) {
        return <Redirect to="/login" />;
    }

    // Need this for live page
    function loadData(currentUser) {
        // Api.getFollowing(currentUser)
        //     .done((data) => {
        //         setFollowingList(data);
        //         console.log(followingList);
        //     })
        //     .fail((xhr, status, error) => {
        //         if ((xhr, status, error === "Cannot find person")) {
        //             alert.show("You are not logged in");
        //         } else if ((xhr, status, error === "Missing person id")) {
        //             alert.show("The person ID is missing");
        //         }
        //     });
    }

    return (
        <div className="content-wrapper">
            <div className="container-fluid">
                {/* <p className="font-weight-bold">Channels you follow</p> */}
                    <div className="row">
                        <div className="col-md-8 mt-9" style={{ textAlign: "left" }}>
                            <VideosCard videoList={videoList} searchTerm={searchTerm} />
                        </div>
                        <div className="col-md-4 mt-9" style={{ textAlign: "left" }}>
                            <SearchCard searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </div>
                    </div>
            </div>
        </div>
    );
}
