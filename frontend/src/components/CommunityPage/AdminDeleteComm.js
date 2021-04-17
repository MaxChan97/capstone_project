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
import BarChartIcon from "@material-ui/icons/BarChart";
import { Link, useLocation } from "react-router-dom";
import { Redirect, useHistory } from "react-router";

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


export default function AdminDeleteComm({ communityId
}) {
    const alert = useAlert();
    const history = useHistory();
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
    }

    function handleDeleteComm() {

        if (reason == "") {
            closeBanPersonModal();
            alert.show("Please enter more details");
        } else {
            Api.adminDeleteCommunity(currentUser, parseInt(communityId), reason, null)
                .done((list) => {
                    closeBanPersonModal();
                    alert.show("Community deleted!");
                    history.push("/admin/inbox");
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
                    <i class='fas fa-exclamation-circle' style={{ color: "#EA3F79" }}></i>{" "}  Delete Community
                </DialogTitle>
                <DialogContent style={{ overflowY: 'visible' }}>
                    <DialogContentText id="confirm-delete-dialog-description" style={{ textAlign: "left" }}>
                        Do you want to delete this community?
                        Community deletion is permanent and cannot be undone.
                </DialogContentText>

                    <p htmlFor="inputReason">Enter reason for admin logs: </p>
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
                        onClick={handleDeleteComm}
                        color="primary"
                        variant="contained"
                    >
                        Confirm
                    </ColorButton>
                </DialogActions>
            </Dialog>
            <ColorButton
                 style={{
                    height: "50px",
                    width: "230px",
                    outline: "none",
                    marginRight: "3%",
                    fontSize:16
                  }}
                onClick={banPerson}
                color="primary"
                variant="contained"
            >
                <i class='fas fa-trash-alt' style={{ color: "white" }}></i> &nbsp; Delete Community
            </ColorButton>
        </div>
    );

}
