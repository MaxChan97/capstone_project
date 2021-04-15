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

export default function ReportDetails() {
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState(false);
    const currentUser = useSelector((state) => state.currentUser);
    const { reportId } = useParams();
    const ColorButton = withStyles((theme) => ({
        root: {
            color: theme.palette.getContrastText("#3B21CB"),
            backgroundColor: "#3B21CB",
            "&:hover": {
                backgroundColor: "#260eab",
            },
        },
    }))(Button);

    useEffect(() => {
        if (reportId) {
            loadData(reportId);
        }
    }, [reportId,refresh]);

    const [formatDate, setFormatDate] = useState();
    function changeDateFormat(r) {
        //remove [UTC] suffix
        var changedDate = r.dateSubmitted.substring(0, r.dateSubmitted.length - 5);
        setFormatDate(changedDate);
    }
    const [data, setData] = useState(null);
    
    function loadData(reportId) {
        Api.getReportById(reportId)
            .done((r) => {
                setData(r);
                changeDateFormat(r);
            })
            .fail(() => {
                //alert.show("Unable to load!");
            });
    }

    function handleVoid(){
        Api.changeReportState(data.id, "VOID", currentUser)
            .done((r) => {
                setRefresh(!refresh);
            })
            .fail(() => {
                //alert.show("Unable to load!");
            });
    }

    function handleResolve(){
        Api.changeReportState(data.id, "RESOLVED", currentUser)
            .done((r) => {
                setRefresh(!refresh);
            })
            .fail(() => {
                //alert.show("Unable to load!");
            });
    }

    return data ? (
        <div className="content-wrapper">
            <div className="container mt-3" style={{ paddingTop: 20, paddingBottom: 5 }}>

                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="far fa-folder-open"></i>
                                {" "} Review Report: {data.reportType}
                            </h3>
                        </div>

                        <div class="card-body">
                            <dl class="row">
                                <dt class="col-sm-2">  Report id:</dt>
                                <dd class="col-sm-10">{data.id}</dd>
                                <dt class="col-sm-2"> Reported by: </dt>
                                <dd class="col-sm-10"><Link to={"/profile/" + data.reporter.id} style={{ color: "#3B21CB", }}>{data.reporter.username}</Link></dd>
                                <dt class="col-sm-2">Reported on: </dt>
                                <dd class="col-sm-10">{moment(formatDate).format("DD/MM/YYYY hh:mm:ss a")}</dd>
                                <dt class="col-sm-2">Report status:</dt>
                                <dd class="col-sm-10">{data.reportState}</dd>
                                {data.reportType != "SYSTEM_REPORT" ? (
                                    <dt class="col-sm-2">Reason:</dt>
                                ) : (<dt class="col-sm-2">Reported feature:</dt>)}
                                <dd class="col-sm-10">{data.category}</dd>
                                <dt class="col-sm-2">User message: </dt>
                                <dd class="col-sm-10">{data.messageBody}</dd>
                                {data.reportType != "SYSTEM_REPORT" ? (
                                    <dd class="col-sm-9"> <Link to={data.reportContentId} style={{ color: "#3B21CB", }}><i class="fas fa-lightbulb"></i> {" "}View Reported Content/User</Link>
                                    </dd>
                                ) : ("")}
                            </dl>
                            {data.reportState == "PENDING" ? (
                               
                            <div style={{ textAlign: "right" }}>
                                <ColorButton
                                    style={{
                                        height: "30px",
                                        width: "100px",
                                        outline: "none",
                                        marginRight: "3%",
                                    }}
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    onClick={handleVoid}
                                >
                                    Void
                                </ColorButton>
                                <ColorButton
                                    style={{
                                        height: "30px",
                                        width: "100px",
                                        outline: "none",
                                        marginRight: "3%",
                                        backgroundColor: "#EA3F79",
                                    }}
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    onClick={handleResolve}
                                >
                                    Resolve
                                </ColorButton>
                            </div>
                             ) : ("")}
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
