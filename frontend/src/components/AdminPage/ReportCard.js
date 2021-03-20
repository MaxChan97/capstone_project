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
            <div className="card-body" >
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
