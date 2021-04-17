import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
} from "@material-ui/core";

import { useSelector } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";
import { Redirect, useHistory } from "react-router";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";


const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
    fontSize: "12px",
  },
}))(Button);

export default function DeletePostModal({
  show,
  handleClose,
  data,
  refresh,
  setRefresh,
}) {
  const currentUser = useSelector((state) => state.currentUser);
  const theme = useTheme();
  const alert = useAlert();
  const history = useHistory();

  async function handleSubmit() {
    Api.deleteProfilePost(currentUser, data.id)
      .done(() => {
        alert.show("Delete success!");
        setRefresh(!refresh);
        handleClose();
        history.push("/profile/" + currentUser);
      })
      .fail((xhr, status, error) => {
        //alert.show("Something went wrong, please try again!");
        handleClose();
      });
  }

  async function handleCancel() {
    handleClose();
  }

  return (

    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="confirm-delete-dialog-title"
      aria-describedby="confirm-delete-dialog-description"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="confirm-delete-dialog-title">
      <i class='fas fa-exclamation-circle' style={{ color: "#EA3F79" }}></i>{" "}  Delete Post
     </DialogTitle>
      <DialogContent style={{ overflowY: 'visible' }}>
        <DialogContentText id="confirm-delete-dialog-description" style={{textAlign:"left"}}>
          Do you want to delete this post from your profile?
          Post deletion is permanent and cannot be undone.
        </DialogContentText>

      </DialogContent>
      <DialogActions>
        <ColorButton
          style={{
            outline: "none",
            marginRight: "3%",
            backgroundColor: "#FFFFFF",
            color: "#4A5056",
          }}
          variant="contained"
          color="secondary"
          type="reset"
          size="small"
          onClick={handleCancel}
        >
          CANCEL
            </ColorButton>
        <span> &nbsp; </span>
        <ColorButton
          style={{
            outline: "none",
            marginRight: "3%",
            textAlign: "right",
          }}
          variant="contained"
          color="primary"
          type="submit"
          size="small"
          onClick={handleSubmit}
        >
          Delete
            </ColorButton>
      </DialogActions>
    </Dialog>
  );
}
