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
import Api from "../../helpers/Api";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";

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
    { value: "Posting inappropriate content", label: "Posting inappropriate content" },
    { value: "Pretending to be someone", label: "Pretending to be someone" },
    { value: "Intellectual property infringement", label: "Intellectual property infringement" },
    { value: "Frauds and scams", label: "Frauds and scams" },
    { value: "Harassment or bullying", label: "Harassment or bullying" },
    { value: "Others", label: "Others" },
];

export default function ReportPerson({
    id,
    username,
    refresh,
    setRefresh,
    anotherPerson,
}) {
    const alert = useAlert();
    const [confirmBanDialogOpen, setConfirmBanDialogOpen] = React.useState(false);
    const [reason, setReason] = useState("");
    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };
    const currentUser = useSelector((state) => state.currentUser);
    //for menu button
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleReport = () => {
        setAnchorEl(null);
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
    const [type, setType] = useState("USER_REPORT");
    const [url, setUrl] = useState("/profile/" + id);
    function handleReportPerson() {
        console.log(reason);
        console.log(currentUser);
        console.log(type);
        console.log(id);
        //console.log(category.value);
        if (category == null) {
            closeBanPersonModal();
            alert.show("Please choose a reason");
        } else {
            Api.createReport(reason, currentUser, type, url, category.value,parseInt(id))
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
                PaperProps={{ style: { overflowY: 'visible' } }}
            >
                <DialogTitle id="confirm-delete-dialog-title">
                    <i class='fas fa-bullhorn'></i> {" "}  Report {username}
                </DialogTitle>
                <DialogContent style={{ overflowY: 'visible' }}>
                    <DialogContentText id="confirm-delete-dialog-description">
                        <p><i class='fas fa-exclamation-circle' style={{ color: "#EA3F79" }}></i>{" "} Help us understand what is happening.</p>
                        <p style={{fontSize: 15}}>We will review the information you give us to help address
                        any issues and to improve our services,
                             subject to our Community Guidelines and Terms of Service.</p>
                    </DialogContentText>
                    <div className="form-group">
                        <label htmlFor="inputIncomeRange">Select a reason: </label>

                        <Select
                            name="categories"
                            options={categories}
                            onChange={setCategory}
                            classNamePrefix="select"
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 })}}
                        />

                    </div>
                    <p htmlFor="inputReason">Enter more details: </p>
                    <input
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

            <Button
                style={{
                    height: "40px",
                    width: "25px",
                    outline: "none",
                }}
            >


                <IconButton
                    style={{ outline: "none" }}
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4,
                            width: "18ch",
                        },
                    }}
                >
                    <MenuItem value={1} onClick={handleReport}>
                        <div>
                            <p>Report this user</p>
                        </div>
                    </MenuItem>
                </Menu>
            </Button>

        </div>
    );

}
