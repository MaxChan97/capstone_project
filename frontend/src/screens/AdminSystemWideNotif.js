import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import Banned from "./AdminBannedAccessPage";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function AdminSystemWideNotif() {
  let history = useHistory();
  const alert = useAlert();
  const classes = useStyles();
  const [refresh, setRefresh] = useState(true);
  const isAdmin = useSelector((state) => state.isAdmin);
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

  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      alert.show("Message cannot be empty");
    } else {
      Api.createSystemWideNotification(link, message)
        .done((response) => {
          setLink("");
          setMessage("");
          history.push("/admin/systemNotif");
          alert.show("Notifications sent!");
        })
        .fail((xhr, status, error) => {
          alert.show("Something went wrong, please try again!");
        });
    }
  };

  function handleCancel() {
    history.push("/admin/systemNotif");
  }

  return isAdmin == true ? (
    <div
      style={{ paddingTop: "24px", paddingLeft: "17px", paddingBottom:"10px"}}
      className="content-wrapper"
    >
      <div class="col-md-10" style={{ textAlign: "left", margin: "auto" }}>
        <div class="card card-primary">
          <form
            onSubmit={handleSubmit}
            className={classes.root}
            noValidate
            autoComplete="off"
          >
            <div class="card-body">
              <Box fontWeight="fontWeightBold" fontSize={25}>
                Send system wide notifications to all users
                {" "}
                <i class='fas fa-users'></i>
              </Box>
              <p>A notification containing the message body will be sent to all users</p>
              <br></br>
              <div className="form-group">
                <label htmlFor="inputMessage">Enter notification message:</label>
                <textarea
                  type="text"
                  id="inputMessage"
                  required
                  className="form-control"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <br></br>
                <label htmlFor="inputLink">Enter a link for users to click on: (optional)</label>
                <input
                  type="text"
                  id="inputLink"
                  required
                  className="form-control"
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                />
              </div>
              <br></br>
              <div style={{ textAlign: "right" }}>
                <Button style={{ outline: "none" }} onClick={handleCancel}>
                  Cancel
                </Button>{" "}
                <ColorButton
                  style={{
                    height: "30px",
                    width: "100px",
                    outline: "none",
                    marginRight: "3%",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Confirm
                </ColorButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <Banned></Banned>
  );
}
