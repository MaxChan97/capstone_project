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
import ReplyList from "./ReplyList";

export default function ReplyCommentCard({ commentData, refresh, setRefresh }) {
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

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser);
    }
  }, [currentUser]);

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
    if (comment.trim() === "") {
      alert.show("Reply cannot be empty");
    } else {
      Api.createReplyForProfileComment(commentData.id, currentUser, comment)
        .done(() => {
          alert.show("Reply successfully created!");
          setComment("");
          setRefresh(!refresh);
        })
        .fail((xhr, status, error) => {
          alert.show("Something went wrong, please try again!");
        });
    }
  };

  const [comment, setComment] = React.useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        marginLeft: "40px",
      }}
    >
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
              minWidth: "75ch",
              maxWidth: "75ch",
            }}
          >
            <div class="post">
              <div class="user-block">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    className="rounded-circle"
                    src={currentPerson.profilePicture || defaultDP}
                  />
                  <span class="username" style={{ marginLeft: 20 }}>
                    <div>
                      <TextField
                        id="standard-textarea"
                        placeholder="Write a reply"
                        multiline
                        size="small"
                        value={comment}
                        onChange={handleComment}
                      />
                    </div>
                  </span>
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
                      marginRight: "8%",
                    }}
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="small"
                  >
                    Reply
                  </ColorButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <ReplyList
        repliesData={commentData.replies}
        refresh={refresh}
        setRefresh={setRefresh}
      ></ReplyList>
    </div>
  );
}
