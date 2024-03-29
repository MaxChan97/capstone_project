import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import CommentCard from "./CommentCard";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    inline: {
        display: "inline",
    },
}));

export default function CommentListForFeed({ comments, refresh, setRefresh, post }) {
    const classes = useStyles();
    const alert = useAlert();

    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        //if (personId) {
        //loadData(personId);
        // }
        var getLatestTwoComments = comments.slice(Math.max(comments.length - 2, 0))
        setDataList(getLatestTwoComments);
    }, [comments, refresh]);

    function loadData(personId) {
        //REPLACE WITH API
        /*
      Api.getPersonsPost(personId)
        .done((postList) => {
          postList.reverse();
          setDataList(postList);
        })
        .fail(() => {
          alert.show("Unable to load posts!");
        });
        */
    }

    return dataList && dataList.length > 0 ? (
        <div>
            <List className={classes.root}>
                {dataList.map((data) => (
                    <div>

                        <CommentCard key={data.id} data={data} refresh={refresh}
                            setRefresh={setRefresh} />

                    </div>
                ))}
            </List>

        </div>
    ) : (
        <p></p>
    );
}
