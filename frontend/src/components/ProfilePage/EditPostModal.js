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

const useStyles = makeStyles({
  cardContainer: {
    background: "white",
    minWidth: 600,
    minHeight: 100,
    paddingLeft: "5%",
    paddingRight: "5%",
    top: '50%',
    transform: 'translate(0, -50%)',
    overflowY: 'auto',
    maxHeight: "auto",
    border: "1px solid #BEBEBE",
    boxShadow: "-10px 10px 4px rgba(0, 0, 0, 0.05)",
    margin: "auto"
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space",
    alignItems: "center",
    paddingTop: "15%",
    padding: 0,
    width: "100%",
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 40,
    margin: 0,
  },
});

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


export default function EditPostModal({ show, handleClose, data }) {
  const styles = useStyles();
  const currentUser = useSelector((state) => state.currentUser);
  const theme = useTheme();
  const alert = useAlert();
  const [post, setPost] = React.useState(data.body);

  const handleEdit = (event) => {
    setPost(event.target.value);
  };

  async function handleCancel() {
    handleClose();
}

  async function handleSubmit() {
    Api.editProfilePost(currentUser, data.id, post)
      .done(() => {
        alert.show("Edit success!");
      })
      .fail((xhr, status, error) => {
        alert.show("Something went wrong, please try again!");
      });
    handleClose();
  }

  return (
    <Modal
      open={show}
      onClose={handleClose}
      style={{
        display: "flex",
        position: "absolute",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        maxHeight: "60%",
        top: "20%",
        alignSelf: "center",
        textAlign: "center"
      }}
    >
      <Card className={styles.cardContainer}>
        <CardContent className={styles.cardContent}>

          <TextField
            label="Edit Post"
            multiline
            value={post}
            onChange={handleEdit}
            fullWidth={true}
          />
          <br></br>
          <div style={{  display: "flex", alignItems: "baseline" }}>
            <ColorButton
              style={{
                outline: "none",
                marginRight: "3%",
                backgroundColor: "#FFFFFF",
                color: "#4A5056"

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
             Edit
            </ColorButton>
          </div>
        </CardContent>
      </Card>
    </Modal>
  );
}
