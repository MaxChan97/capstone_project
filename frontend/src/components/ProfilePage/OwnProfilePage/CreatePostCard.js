import React, { useState } from "react";
import defaultDP from "../../../assets/Default Dp logo.svg";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../../helpers/Api";
import { useAlert } from "react-alert";
import { storage } from "../../../firebase";
import FileTypes from "../../../components/FileTypes.js";
import chatPaperClip from "../../../assets/chatPaperClip.png";

var uuid = require("uuid");

export default function CreatePostCard({ personId, refresh, setRefresh }) {
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

  const [post, setPost] = React.useState("");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [progress, setProgress] = useState(0);

  const handlePost = (event) => {
    setPost(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Api.createPostForPerson(personId, post, fileName, fileUrl, fileType)
      .done(() => {
        alert.show("Post successfully created!");
        setPost("");
        setFileName("");
        setFileUrl("");
        setFileType("");
        setProgress(0);
        setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        alert.show("Something went wrong, please try again!");
      });
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
        }
      );
    }
  };

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <div
          className="card"
          style={{
            minWidth: "82ch",
            maxWidth: "82ch",
          }}
        >
          <div className="card-body">
            <div className="row">
              <div className="col-1">
                <img src={defaultDP} />
              </div>
              <div className="col-11">
                {fileUrl &&
                  fileName &&
                  fileType &&
                  (fileType.split("/")[0] == "image" ? (
                    progress < 100 ? (
                      <progress value={progress} max="100" />
                    ) : (
                      <img
                        className="mx-auto d-block"
                        width="300"
                        src={fileUrl}
                      />
                    )
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
                  InputProps={{ disableUnderline: true }}
                  value={post}
                  onChange={handlePost}
                  autoFocus
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <label for="pic" className="btn">
                  <img
                    style={{ height: "26px" }}
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
                <a
                  href="#"
                  className="link-black text-sm"
                  style={{ marginLeft: 10 }}
                >
                  <i className="fas fa-poll fa-2x"></i>
                </a>
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
  );
}
