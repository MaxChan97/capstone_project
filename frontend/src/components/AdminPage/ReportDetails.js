import React, { useState } from "react";
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

export default function ReportDetails() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.currentUser);



    const ColorButton = withStyles((theme) => ({
        root: {
            color: theme.palette.getContrastText("#3B21CB"),
            backgroundColor: "#3B21CB",
            "&:hover": {
                backgroundColor: "#260eab",
            },
        },
    }))(Button);

    return (
        <div className="content-wrapper">
            <div className="container mt-3">
                <div className="row">
                    <div className="col-md-12 mt-3" style={{margin:"auto"}}>
                        <div className="card card-primary">
                            <div className="card-body">
                                <Box fontWeight="fontWeightMedium" fontSize={23}>
                                    Review Report: User report
                                </Box>
                                <Box fontWeight="fontWeightLight" fontSize={20}>
                                    Report id: 1
                                </Box>

                                <div style={{ display: "flex", alignItems: "baseline" }}>
                                    <Box fontWeight="fontWeightLight" fontSize={20}>
                                        Reported by:
                                    </Box>
                                &nbsp;
                                <Link to={"/profile/" + 2} style={{ color: "#3B21CB", }}>User 2 </Link>
                                </div>
                                <div style={{ display: "flex", alignItems: "baseline" }}>
                                    <Box fontWeight="fontWeightLight" fontSize={20}>
                                        Reported on:
                                    </Box>
                                    &nbsp;
                                    <Box fontWeight="fontWeightLight" fontSize={20}>
                                        {moment().format("DD/MM/YYYY hh:mm:ss a")}
                                    </Box>
                                </div>
                                <div style={{ display: "flex", alignItems: "baseline" }}>
                                    <Box fontWeight="fontWeightLight" fontSize={20}>
                                        Report status:
                                    </Box>
                                    &nbsp;
                                    <Box fontWeight="fontWeightLight" fontSize={20}>
                                        Pending
                                    </Box>

                                </div>
                                <br>
                                </br>
                                <p>Report Reason: Frauds and scams</p>
                                <Box fontWeight="fontWeightRegular" fontSize={20}>
                                    User Message:
                                </Box>

                                <Box fontWeight="fontWeightRegular" fontSize={20}>
                                    User is deceiving others to generate a financial or personal benefit
                                    to the detriment of a third party or entity through
                                    investment or financial scams
                                </Box>
                                <br></br>
                                <Link style={{ color: "#3B21CB", }}>Reported Content/User</Link>
                                <br></br>
                                <br></br>
                                <div style={{ textAlign: "right" }}>
                                    <ColorButton
                                        style={{
                                            height: "30px",
                                            width: "100px",
                                            outline: "none",
                                            marginRight: "3%",
                                        }}
                                        href="/admin/reportDetails"
                                        variant="contained"
                                        color="primary"
                                        type="button"
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
                                        href="/admin/reportDetails"
                                        variant="contained"
                                        color="primary"
                                        type="button"
                                    >
                                        Resolve
                                    </ColorButton>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
