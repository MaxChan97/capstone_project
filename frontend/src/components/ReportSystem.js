import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAlert } from "react-alert";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import Flag from "../assets/flags.svg";
import BarChartIcon from "@material-ui/icons/BarChart";
import { Link, useLocation } from "react-router-dom";

const ITEM_HEIGHT = 23;
const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText("#3B21CB"),
        backgroundColor: "#3B21CB",
        "&:hover": {
            backgroundColor: "#260eab",
        },
    },
}))(Button);
const categories = [
    { value: "Chat", label: "Chat"},
    { value: "Community", label: "Community" },
    { value: "Live Stream/Video", label: "Live Stream/Video" },
    { value: "Login/Password", label: "Login/Password" },
    { value: "Payment/Subscription", label: "Payment/Subscription" },
    { value: "Posts", label: "Posts" },
    { value: "Profile", label: "Profile" },
    { value: "Others", label: "Others" },
];

export default function ReportSystem({
}) {
    const alert = useAlert();
    const [confirmBanDialogOpen, setConfirmBanDialogOpen] = React.useState(false);
    const [reason, setReason] = useState("");
    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };
    const currentUser = useSelector((state) => state.currentUser);

    const handleReport = () => {
        banPerson();
    };

    function banPerson() {
        openBanPersonModal();
    };

    function openBanPersonModal() {
        setConfirmBanDialogOpen(true);
    }

    function closeBanPersonModal() {
        setConfirmBanDialogOpen(false);
        setReason("");
        setCategory(null);
    }

    const [category, setCategory] = useState(null);
    const [type, setType] = useState("SYSTEM_REPORT");
    const [url, setUrl] = useState("");
    function handleReportPerson() {
        console.log(reason);
        console.log(currentUser);
        console.log(type);
        console.log(url);
        //console.log(category.value);
        if (category == null) {
            closeBanPersonModal();
            alert.show("Please choose a reason");
        } else if (reason == "") {
            closeBanPersonModal();
            alert.show("Please enter more details");
        } else {
            Api.createReport(reason, currentUser, type, url, category.value,0)
                .done((list) => {
                    closeBanPersonModal();
                    alert.show("Report sent");
                })
                .fail(() => {
                    closeBanPersonModal();
                    alert.show("Error. Please try again later");
                });
        }
    }



    return (
        <div >
            <Dialog
                open={confirmBanDialogOpen}
                onClose={closeBanPersonModal}
                aria-labelledby="confirm-delete-dialog-title"
                aria-describedby="confirm-delete-dialog-description"
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle id="confirm-delete-dialog-title">
                    <i class='fas fa-bullhorn'></i> {" "}  Report System Issue
                </DialogTitle>
                <DialogContent style={{ overflowY: 'visible' }}>
                    <DialogContentText id="confirm-delete-dialog-description">
                        <p style={{ fontSize: 19 }}>
                        <i class='fas fa-exclamation-circle' style={{ color: "#EA3F79" }}></i>{" "} What went wrong? Providing details helps us find the problem. 
                        Reporting issues when they happen helps make Bull&Bear better, and we appreciate the time it takes to give us this information.
                        <br></br> </p>
                           <p style={{ fontSize: 16}}>As people send us reports about broken features, 
                           we review them and sometimes get in touch for more info to help us resolve the problem. 
                           While we don't reply to every report, we'll let you know if we need more details.</p>
                    </DialogContentText>
                    <div className="form-group">
                        <label htmlFor="inputIncomeRange">Select a feature: </label>

                        <Select
                            name="categories"
                            options={categories}
                            onChange={setCategory}
                            classNamePrefix="select"
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 })}}
                        />

                    </div>
                    <p htmlFor="inputReason">Enter more details: </p>
                    <textarea
                        type="text"
                        id="inputReason"
                        className="form-control"
                        value={reason}
                        required="required"
                        onChange={handleReasonChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button style={{ outline: "none" }} onClick={closeBanPersonModal}>
                        Cancel
                            </Button>
                    <ColorButton
                        style={{ outline: "none" }}
                        onClick={handleReportPerson}
                        color="primary"
                        variant="contained"
                        autoFocus
                    >
                        Confirm
                    </ColorButton>
                </DialogActions>
            </Dialog>
            <Link className="nav-link" onClick={handleReport} style={{ color: "#4A5056", }}>
                <img
                    src={Flag}
                    className="nav-icon"
                    alt="ReportLogo"

                />
                {" "}
                <p className="ml-1">Report</p>
            </Link>

        </div>
    );

}
