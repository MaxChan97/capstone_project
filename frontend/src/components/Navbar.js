import React, { useState, useEffect } from "react";
import searchLogo from "../assets/Search logo.svg";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  InputBase,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import liveLogo from "../assets/Live Logo.svg";
import uploadLogo from "../assets/Upload logo.svg";
import chatLogo from "../assets/Chat logo.svg";
import notificationLogo from "../assets/Notification Logo.svg";
import defaultDP from "../assets/Default Dp logo.svg";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import Api from "../helpers/Api";
import logout from "../assets/logout 1.svg";
import { logOut, setIsAdmin } from "../redux/actions/index";
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import CircularProgressWithLabel from "../components/CircularProgressWithLabel.js";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 500,
    backgroundColor: "#EAECEF",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

function Navbar({
  searchString,
  setSearchString,
  searchRefresh,
  setSearchRefresh,
}) {
  let location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentPerson, setCurrentPerson] = useState({});
  const isAdmin = useSelector((state) => state.isAdmin);
  const [
    confirmStartStreamDialogOpen,
    setConfirmStartStreamDialogOpen,
  ] = useState(false);

  const [title, setTitle] = useState();
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const [description, setDescription] = useState();
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const [refresh, setRefresh] = useState(true);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [progress, setProgress] = useState();

  const [uploadDialog, setShowUploadDialog] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser && isAdmin == false) {
      loadData(currentUser);
    }
  }, [currentUser, location.pathname]);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  function handleStartStreamDialogOpen() {
    setConfirmStartStreamDialogOpen(true);
  }

  function handleStartStreamDialogClose() {
    setConfirmStartStreamDialogOpen(false);
  }

  function handleStartStream() {
    handleStartStreamDialogClose();
    history.push("/stream");
  }

  function renderStartStreamDialog() {
    return (
      <Dialog
        open={confirmStartStreamDialogOpen}
        onClose={handleStartStreamDialogClose}
        aria-labelledby="confirm-start-stream-dialog-title"
        aria-describedby="confirm-start-stream-dialog-description"
      >
        <DialogTitle id="confirm-start-stream-dialog-title">
          Confirm start stream
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-start-stream-dialog-description">
            Would you like to start a stream?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ outline: "none" }}
            onClick={handleStartStreamDialogClose}
          >
            Cancel
          </Button>
          <ColorButton
            style={{ outline: "none" }}
            color="primary"
            variant="contained"
            onClick={handleStartStream}
          >
            Confirm
          </ColorButton>
        </DialogActions>
      </Dialog>
    );
  }

  function handleUploadDialogOpen() {
    setShowUploadDialog(true);
  }

  function handleUploadDialogClose() {
    setShowUploadDialog(false);
  }

  // const handleUpload = () => {
  //   Api.uploadVideo(title, description, fileName, fileUrl, fileType)
  //     .done(() => {
  //       alert.show("Video uploaded successfully!");
  //       setRefresh(!refresh);
  //       handleUploadDialogClose();
  //     })
  //     .fail((xhr, status, error) => {
  //       //alert.show("Something went wrong, please try again!");
  //       alert.show(xhr.responseJSON.error);
  //     });
  // };

  function handleUploadStart() {
    setProgress(0);
  }

  function handleUploadError() {
    alert("error");
  }

  function handleUploadSuccess(filename) {
    firebase
      .storage()
      .ref("videos")
      .child(filename)
      .getDownloadURL()
      .then((url) => {
        setFileUrl(url);
        setProgress(100);
        setFileName(filename);
        var suffix = filename.split(".")[1];
        setFileType("video/" + suffix);
      });
  }

  function handleProgress(progress) {
    setProgress(progress);
  }

  function renderUploadDialog() {
    return (
      <Dialog open={uploadDialog} onClose={handleUploadDialogClose}>
        <DialogTitle id="confirm-start-stream-dialog-title">
          <b>Upload Video</b>
        </DialogTitle>
        <DialogActions>
          <div className="container">
            <div className="row ml-1">
              <form>
                <div className="ml-2 mr-4">
                  <div className="form-group">
                    {progress >= 0 && progress < 100 ? (
                      <div className="d-flex justify-content-center">
                        <CircularProgressWithLabel value={progress} />
                      </div>
                    ) : (
                      fileUrl && (
                        <div className="d-flex justify-content-center">
                          <iframe height="100%" src={fileUrl}></iframe>
                        </div>
                      )
                    )}
                    <div className="row mt-2 justify-content-center">
                      <label
                        className="btn"
                        style={{
                          height: "40px",
                          width: "220px",
                          backgroundColor: "#3B21CB",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Choose Video to Upload
                        <FileUploader
                          hidden
                          accept="video/*"
                          randomizeFilename={true}
                          storageRef={firebase.storage().ref("videos")}
                          onUploadStart={handleUploadStart}
                          onUploadError={handleUploadError}
                          onUploadSuccess={handleUploadSuccess}
                          onProgress={handleProgress}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="inputTitle">Title</label>
                    <input
                      type="text"
                      id="inputTitle"
                      // required
                      style={{
                        width: "400px",
                        marginTop: "13px",
                        marginBottom: "20px",
                      }}
                      className="form-control"
                      onChange={handleTitleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputDescription">Description</label>
                    <textarea
                      className="form-control"
                      value={description}
                      style={{
                        width: "400px",
                        height: "100px",
                        marginTop: "13px",
                        marginBottom: "20px",
                      }}
                      onChange={handleDescriptionChange}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="row mr-3 mb-2" style={{ float: "right" }}>
              <Button
                style={{ outline: "none" }}
                onClick={handleUploadDialogClose}
              >
                Cancel
              </Button>
              <ColorButton
                style={{ outline: "none" }}
                color="primary"
                variant="contained"
                // onClick={handleUpload}
              >
                Confirm
              </ColorButton>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    );
  }

  function handleSearch(event) {
    if (searchString != null && searchString != "") {
      if (location.pathname === "/search") {
        setSearchRefresh(!searchRefresh);
      }
      history.push("/search");
    }
  }

  function handleEnterKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  }

  function loadData(currentUser) {
    Api.getPersonById(currentUser)
      .done((currentPerson) => {
        setCurrentPerson(currentPerson);
        handleBannedPerson(currentPerson);
      })
      .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
      });
  }

  function handleLogOut(e) {
    e.preventDefault();
    dispatch(logOut());
    dispatch(setIsAdmin(null));
  }

  function onClickStreamButton(e) {
    e.preventDefault();
    if (location.pathname !== "/stream") {
      handleStartStreamDialogOpen();
    }
  }

  function handleBannedPerson(p) {
    if (p.isBannedFromLogin == true) {
      dispatch(logOut());
      dispatch(setIsAdmin(null));
      history.push("/banned");
    }
  }

  return (
    <nav
      style={{
        flex: "1",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
      className="main-header navbar navbar-expand bg-white navbar-light border-bottom"
    >
      <div>
        <ul className="navbar-nav" style={{ cursor: "default" }}>
          <li className="nav-item" style={{ cursor: "default" }}>
            <a className="nav-link" style={{ cursor: "default" }}>
              <i
                style={{ fontSize: "18px", visibility: "hidden" }}
                className="fa fa-bars"
              />
            </a>
          </li>
        </ul>
      </div>
      <div>
        <Paper component="form" className={classes.root}>
          <IconButton
            style={{ outline: "none" }}
            className={classes.iconButton}
            aria-label="search"
            onClick={handleSearch}
          >
            <img src={searchLogo} alt="searchLogo" />
          </IconButton>
          <InputBase
            value={searchString}
            className={classes.input}
            placeholder="Search"
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
            onKeyPress={handleEnterKeyPress}
          />
        </Paper>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          width: "21%",
        }}
      >
        <Link onClick={onClickStreamButton}>
          <img src={liveLogo} alt="liveLogo" />
        </Link>
        <Link onClick={handleUploadDialogOpen}>
          <img src={uploadLogo} alt="uploadLogo" />
        </Link>
        <Link to={"/chat/" + currentUser}>
          <img src={chatLogo} alt="chatLogo" />
        </Link>
        <Link to="/">
          <img src={notificationLogo} alt="notificationLogo" />
        </Link>
        <Link onClick={handleLogOut}>
          <img src={logout} alt="log out" />
        </Link>
        <Link to={"/profile/" + currentUser}>
          <img
            className="rounded-circle"
            style={{ height: "3vh" }}
            src={currentPerson.profilePicture || defaultDP}
          />
        </Link>
      </div>
      {renderStartStreamDialog()}
      {renderUploadDialog()}
    </nav>
  );
}
export default Navbar;
