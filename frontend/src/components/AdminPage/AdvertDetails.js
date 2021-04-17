import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { logOut } from "../../redux/actions/index";
import { withStyles } from "@material-ui/core/styles";
import Api from "../../helpers/Api";
import Box from "@material-ui/core/Box";
import moment from "moment";
import { Link } from "react-router-dom";
import { typography } from '@material-ui/system';
import { useParams } from "react-router";
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";

export default function ReportDetails() {
    const dispatch = useDispatch();
    
const useStyles = makeStyles((theme) => ({

    chip: {
      display: "flex",
      justifyContent: "left",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
  }));
  const classes = useStyles();
    const [refresh, setRefresh] = useState(false);
    const currentUser = useSelector((state) => state.currentUser);
    const { advertId } = useParams();


    useEffect(() => {
        if (advertId) {
            loadData(advertId);
        }
    }, [advertId, refresh]);

    const [formatDate, setFormatDate] = useState();
    function changeDateFormat(r) {
        //remove [UTC] suffix
        var changedDate = r.datePosted.substring(0, r.datePosted.length - 5);
        setFormatDate(changedDate);
    }
    const [data, setData] = useState(null);
    const [adLink, setAdLink] = useState("");
    function loadData(advertId) {
        Api.getAdvertisementById(advertId)
            .done((r) => {
                setData(r);
                changeDateFormat(r);
                setAdLink("https://" + r.linkTo);
            })
            .fail(() => {
                //alert.show("Unable to load!");
            });
    }

    function toTitleCase(str) {
        var i,
          frags = str.split("_");
        for (i = 0; i < frags.length; i++) {
          frags[i] =
            frags[i].charAt(0).toUpperCase() + frags[i].substr(1).toLowerCase();
        }
        return frags.join(" ");
      }


    return data ? (
        <div>
            <div className="content-wrapper">
                <div className="container mt-3" style={{ paddingTop: 20, paddingBottom: 5 }}>

                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">
                                    <i class="far fa-folder-open"></i>
                                    {" "} View Advertisement: {data.title}
                                </h3>
                            </div>

                            <div class="card-body">
                                <dl class="row">
                                    <dt class="col-sm-2"> Id:</dt>
                                    <dd class="col-sm-10">{data.id}</dd>
                                    <dt class="col-sm-2"> Website Link: </dt>
                                    <dd class="col-sm-10"><a href={adLink} target="_blank" rel="noopener noreferrer">{data.linkTo}</a></dd>
                                    <dt class="col-sm-2">Added on: </dt>
                                    <dd class="col-sm-10">{moment(formatDate).format("DD/MM/YYYY hh:mm:ss a")}</dd>
                                    <dt class="col-sm-2">Description: </dt>
                                    <dd class="col-sm-10">{data.description}</dd>
                                    <dt class="col-sm-2">Topic interests: </dt>
                                    <dd class="col-sm-10">
                                    {data.topics !== undefined ? (
                                        <div component="ul" className={classes.chip}>
                                            {data.topics.map((topics, index) => (
                                                <Chip
                                                    label={toTitleCase(topics)}
                                                    key={index}
                                                    style={{ backgroundColor: "#F1F3F8" }}
                                                />
                                            ))}
                                        </div>
                                    ) : null}
                                    </dd>
                                    <dt class="col-sm-2">Image: </dt>
                                    <img
                                        className="mx-auto d-block"
                                        width="750px"
                                        src={data.image}
                                    />
                                </dl>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    ) : (
        <div style={{ margin: "auto", textAlign: "center" }}>
            <CircularProgress />
        </div>
    );
}
