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

export default function ReportCard() {
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


        <div className="card card-primary">
            <div className="card-body" style={{lineHeight: "5px"}} >
                <h5>Review Report: User report</h5>
               

                <p>Report id: 1</p>

                <div style={{ display: "flex", alignItems: "baseline" }}>
                    <p>Reported by:</p>
                    &nbsp;
                    <Link to={"/profile/" + 2} style={{ color: "#3B21CB", }}>User 2 </Link>
                </div>
                <div style={{ display: "flex", alignItems: "baseline" }}>

                    <p>Reported on:</p>
                                &nbsp;

                        {moment().format("DD/MM/YYYY hh:mm:ss a")}

                </div>
                <p>Report Reason: Frauds and scams</p>
                <div style={{ display: "flex", alignItems: "baseline" }}>

                    <p>Report status: pending</p>

                </div>
                
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
                        Review
                </ColorButton>
                </div>
            </div>
        </div>



    );
}
