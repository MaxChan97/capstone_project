import React, { useState, useEffect } from "react";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";
import { storage } from "../../firebase";
import FileTypes from "../FileTypes.js";
import chatPaperClip from "../../assets/chatPaperClip.png";
import postPoll from "../../assets/postPoll.png";
import { useSelector } from "react-redux";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel.js";

var uuid = require("uuid");

export default function CreatePostCard({ community, refresh, setRefresh }) {
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
    },
  }))(Button);

  const classes = useStyles();
  const alert = useAlert();
  const isAdmin = useSelector((state) => state.isAdmin);

  const [post, setPost] = React.useState("");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [progress, setProgress] = useState(0);

  const [showPollInput, setShowPollInput] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const currentUser = useSelector((state) => state.currentUser);
  const [currentPerson, setCurrentPerson] = useState({});

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

  const handlePost = (event) => {
    setPost(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (post.trim() === "") {
      alert.show("Post cannot be empty");
    } else if (showPollInput === true && pollQuestion.trim() === "") {
      alert.show("Poll question cannot be empty");
    } else if (showPollInput === true && pollOptions.indexOf("") !== -1) {
      alert.show("One of your poll options is empty");
    } else {
      Api.createCommunityPost(
        community.id,
        currentUser,
        post,
        fileName,
        fileUrl,
        fileType,
        pollQuestion,
        pollOptions
      )
        .done(() => {
          alert.show("Post successfully created!");
          setPost("");
          setFileName("");
          setFileUrl("");
          setFileType("");
          setProgress(0);
          setPollQuestion("");
          setPollOptions(["", ""]);
          setShowPollInput(false);
          setRefresh(!refresh);
        })
        .fail((xhr, status, error) => {
          alert.show(
            "Something went wrong, please try again! / Exceed character limit!"
          );
        });
    }
  };

  const changeFileHandler = (event) => {
    if (event.target.files[0] != undefined) {
      var oldName = event.target.files[0].name;
      setFileName(event.target.files[0].name);
      setFileType(event.target.files[0].type);
      var suffix = oldName.split(".")[1];
      var randomId = uuid.v4();
      var newName = randomId.toString() + "." + suffix;
      const uploadTask = storage
        .ref(`files/${newName}`)
        .put(event.target.files[0]);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("files")
            .child(newName)
            .getDownloadURL()
            .then((url) => {
              setFileUrl(url);
            });
          event.target.value = null;
        }
      );
    }
  };
  /*
  function handleClosePollInput() {
    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowPollInput(false);
  }
*/
  return isAdmin == false ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <div
          className="card"
          style={{
            margin: "auto",
          }}
        >
          <div className="card-body">
            <div className="row">
              <div className="col-1">
                <img
                  className="img-fluid rounded-circle"
                  src={currentPerson.profilePicture || defaultDP}
                />
              </div>
              <div className="col-11">
                {fileName &&
                  fileType &&
                  (progress >= 0 && progress < 100 ? (
                    <div className="d-flex justify-content-center">
                      <CircularProgressWithLabel value={progress} />
                    </div>
                  ) : fileType.split("/")[0] == "image" ? (
                    <img
                      className="mx-auto d-block"
                      width="300"
                      src={fileUrl}
                    />
                  ) : fileType.split("/")[0] == "video" ? (
                    <div className="d-flex justify-content-center">
                      <iframe height="100%" src={fileUrl}></iframe>
                    </div>
                  ) : (
                    <div>
                      <FileTypes data={fileName.split(".")[1]}></FileTypes>
                      <p className="text-center font-weight-bold">
                        {fileName.split(".")[0]}
                      </p>
                    </div>
                  ))}

                <TextField
                  id="standard-textarea"
                  placeholder="What's new?"
                  multiline
                  fullWidth
                  InputProps={{ disableUnderline: true }}
                  value={post}
                  onChange={handlePost}
                  autoFocus
                />
                {post !== "" ? (
                  <p style={{ textAlign: "right" }}>{post.length}/2048</p>
                ) : (
                  <p style={{ textAlign: "right" }}>0/2048</p>
                )}
              </div>
            </div>
            {/* 
            {showPollInput === true ? (
              <div className="row" style={{ marginBottom: "10px" }}>
                
                <CreatePollCard
                  handleClosePollInput={handleClosePollInput}
                  pollQuestion={pollQuestion}
                  setPollQuestion={setPollQuestion}
                  pollOptions={pollOptions}
                  setPollOptions={setPollOptions}
                />
                
              </div>
            ) : (
                ""
              )}
              */}
            <div className="row">
              <div className="col-6">
                <label style={{ paddingTop: "13px" }} for="pic" className="btn">
                  <img
                    style={{ height: "25px" }}
                    src={chatPaperClip}
                    alt="chatPaperClip"
                  />

                  <input
                    id="pic"
                    type="file"
                    name="file"
                    style={{ display: "none" }}
                    onChange={changeFileHandler}
                  />
                </label>
                {/*
                <button
                  type="button"
                  style={{
                    outline: "none",
                    padding: "0px",
                    border: "none",
                    background: "none",
                  }}
                  onClick={() => setShowPollInput(true)}
                >
                
                  <img
                    style={{ height: "25px" }}
                    src={postPoll}
                    alt="postPoll"
                  />
                </button>
                 */}
              </div>
              <div className="col-6">
                <div style={{ textAlign: "right" }}>
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
                    Share
                  </ColorButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  ) : (
    ""
  );
}
