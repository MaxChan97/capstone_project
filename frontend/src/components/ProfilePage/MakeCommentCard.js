import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";

export default function MakeCommentCard({ data, refresh, setRefresh }) {
  const alert = useAlert();
  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
      },
    },
  }));

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

  const classes = useStyles();

  const handleComment = (event) => {
    setComment(event.target.value);
  };

  const handleCancel = (event) => {
    setComment("");
  };
  const [currentPerson, setCurrentPerson] = useState({});
  const currentUser = useSelector((state) => state.currentUser);
  const isAdmin = useSelector((state) => state.isAdmin);
  useEffect(() => {
    if (currentUser) {
      loadData(currentUser);
    }
  }, [currentUser, refresh]);

  function loadData(currentUser) {
    Api.getPersonById(currentUser)
      .done((currentPerson) => {
        setCurrentPerson(currentPerson);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //replace with actual api when done
    if (comment.trim() === "") {
      alert.show("Comment cannot be empty");
    } else {
      Api.createCommentForProfilePosts(data.id, currentUser, comment)
        .done(() => {
          alert.show("Comment successfully created!");
          setComment("");
          setRefresh(!refresh);
        })
        .fail((xhr, status, error) => {
          alert.show("Something went wrong, please try again!");
        });
    }
  };

  const [comment, setComment] = React.useState("");

  return isAdmin == false ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
      }}
    >
      <Divider variant="middle" />
      <Box
        fontWeight="fontWeightBold"
        fontSize={13}
        m={1}
        style={{ marginLeft: "30px" }}
      >
        {data.comments.length} Comments
      </Box>
      <Divider variant="middle" />
      <form
        onSubmit={handleSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <div class="col-md-9">
          <div
            class="card-body"
            style={{
              minWidth: "80ch",
              maxWidth: "80ch",
            }}
          >
            <div class="post">
              <div class="user-block">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    className="rounded-circle"
                    src={currentPerson.profilePicture || defaultDP}
                  />
                  <TextField
                    id="standard-textarea"
                    placeholder="Write a comment"
                    multiline
                    fullWidth
                    value={comment}
                    onChange={handleComment}
                  />
                </div>
              </div>
              <div style={{ alignItems: "baseline" }}>
                <div style={{ textAlign: "right" }}>
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
                  <ColorButton
                    style={{
                      outline: "none",
                      marginRight: "3%",
                    }}
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="small"
                  >
                    Comment
                  </ColorButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Divider variant="middle" />
    </div>
  ) : (
    <Divider variant="middle" />
  );
}
