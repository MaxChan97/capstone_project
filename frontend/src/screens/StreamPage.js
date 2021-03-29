import React, { useState, useEffect, useRef } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { io } from "socket.io-client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Switch,
  Grid,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
const prettyMilliseconds = require("pretty-ms");

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function StreamPage() {
  const alert = useAlert();
  const currentUser = useSelector((state) => state.currentUser);
  const history = useHistory();

  const [showContinueDialog, setShowContinueDialog] = useState(true);
  const [showStartStreamDialog, setShowStartStreamDialog] = useState(false);
  const [showEndStreamDialog, setShowEndStreamDialog] = useState(false);
  const [showEditInfoDialog, setShowEditInfoDialog] = useState(false);
  const [videoStart, setVideoStart] = useState(false);
  const [streamId, setStreamId] = useState();
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [streamSubscribersOnly, setStreamSubscribersOnly] = useState(false);
  const [tempStreamTitle, setTempStreamTitle] = useState("");
  const [tempStreamDescription, setTempStreamDescription] = useState("");
  const [tempStreamSubscribersOnly, setTempStreamSubscribersOnly] = useState(
    false
  );
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [streamEnded, setStreamEnded] = useState(false);

  useEffect(() => {
    connectServer();
    requestMedia();

    return function cleanup() {
      if (streamId != undefined) {
        Api.endStream(streamId)
          .then(() => {})
          .fail((xhr, status, error) => {
            alert.show(xhr.responseJSON.error);
          });
      }
      if (start != 0) {
        clearInterval(window.streamTimer);
      }
      stopStream();
      disconnectServer();
    };
  }, []);

  useEffect(() => {
    if (videoStart === true) {
      window.streamTimer = setInterval(() => {
        setDuration(Date.now() - start);
      }, 1000);
    }
  }, [start]);

  function stopStream() {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  }

  function disconnectServer() {
    if (socket) {
      socket.disconnect();
    }
  }

  // Attributes needed for stream
  const url =
    "rtmp://broadcast.api.video/s/d74762c5-c2bd-4408-abe7-17d63b69852d";
  const socketio_address = "http://localhost:1437";
  const width = 750;
  const height = 450;
  const frameRate = 15;
  const audioBitRate = 22050;

  // Setting things up
  var mediaRecorder;
  var socket;
  var state = "stop";

  const videoRef = useRef(null);

  // Functions for streaming
  function showVideo(stream) {
    let video = videoRef.current;
    video.srcObject = stream;
    video.play();
  }

  // Connect to server (localhost 1437)
  function connectServer() {
    navigator.getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.mozGetUserMedia ||
      navigator.mediaDevices.msGetUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia;
    if (!navigator.getUserMedia) {
      alert.show("No getUserMedia() available");
    }
    if (!MediaRecorder) {
      alert.show("No MediaRecorder available");
    }
    var socketOptions = {
      secure: true,
      reconnection: true,
      reconnectionDelay: 1000,
      timeout: 15000,
      pingTimeout: 15000,
      pingInterval: 45000,
      query: { framespersecond: frameRate, audioBitrate: audioBitRate },
    };
    socket = io(socketio_address, socketOptions);
    socket.on("connect_timeout", (timeout) => {
      //alert.show("state on connection timeout= " + timeout);
    });
    socket.on("error", (error) => {
      //alert.show("error= " + error);
    });
    socket.on("connect_error", function (e) {
      //alert.show("connection error");
      //alert.show("state on connection error= " + state);
    });
    socket.on("message", function (m) {
      //alert.show("state on message= " + state);
      //alert.show("recv server message= " + m);
    });
    socket.on("fatal", function (m) {
      //alert.show("Fatal error:" + m);
      //alert.show("state on fatal error= " + state);
    });
    socket.on("ffmpeg_stderr", function (m) {
      //alert.show("FFMPEG error: " + m);
    });
    socket.on("disconnect", function (reason) {
      //alert.show("state on disconnect= " + state);
      //alert.show("server disconnected because: " + reason);
    });

    state = "ready";
    //alert.show("server connection successful");
  }

  // Start stream (requestMedia)
  function requestMedia() {
    const constraints = {
      audio: { sampleRate: audioBitRate, echoCancellation: true },
      video: {
        width: { min: 100, ideal: width, max: 1920 },
        height: { min: 100, ideal: height, max: 1080 },
        frameRate: { ideal: frameRate },
      },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        showVideo(stream);
        socket.emit("config_rtmpDestination", url);
        socket.emit("start", "start");
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(250);
        mediaRecorder.onstop = function (e) {
          //alert.show("mediaRecorder stopped: " + e);
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
        };
        mediaRecorder.onpause = function (e) {
          //alert.show("mediaRecorder paused: " + e);
        };
        mediaRecorder.onerror = function (event) {
          let error = event.error;
          //alert.show("mediaRecorder error: " + event.name);
        };
        mediaRecorder.ondataavailable = function (e) {
          socket.emit("binarystream", e.data);
          state = "start";
          //alert.show("data avail");
        };
      })
      .catch(function (err) {
        //alert.show("error: " + err);
        state = "stop";
      });
  }

  function handleContinueDialogOpen() {
    setShowContinueDialog(true);
  }

  function handleContinueDialogClose() {
    setShowContinueDialog(false);
  }

  function handleStartStreamDialogOpen() {
    setShowStartStreamDialog(true);
  }

  function handleStartStreamDialogClose() {
    setShowStartStreamDialog(false);
  }

  function handleEndStreamDialogOpen() {
    setShowEndStreamDialog(true);
  }

  function handleEndStreamDialogClose() {
    setShowEndStreamDialog(false);
  }

  function handleEditInfoDialogOpen() {
    setShowEditInfoDialog(true);
  }

  function handleEditInfoDialogCloseNoEdit() {
    setTempStreamTitle(streamTitle);
    setTempStreamDescription(streamDescription);
    setTempStreamSubscribersOnly(streamSubscribersOnly);
    setShowEditInfoDialog(false);
  }

  function handleEditInfoDialogCloseWithEdit() {
    setShowEditInfoDialog(false);
  }

  function handleCancelContinue() {
    handleContinueDialogClose();
    history.goBack();
  }

  function handleContinue() {
    if (tempStreamTitle === "") {
      alert.show("Please enter a stream title");
    } else if (tempStreamDescription === "") {
      alert.show("Please enter a stream description");
    } else {
      handleContinueDialogClose();
      setVideoStart(true);
      setStreamTitle(tempStreamTitle);
      setStreamDescription(tempStreamDescription);
      setStreamSubscribersOnly(tempStreamSubscribersOnly);
    }
  }

  function handleStartStream() {
    handleStartStreamDialogClose();
    Api.startStream(
      currentUser,
      streamTitle,
      streamDescription,
      streamSubscribersOnly
    )
      .then((stream) => {
        setStreamId(stream.id);
        setStart(Date.now());
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleEndStream() {
    handleEndStreamDialogClose();
    clearInterval(window.streamTimer);
    Api.endStream(streamId)
      .then(() => {
        setStreamEnded(true);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function handleEditInfo() {
    if (tempStreamTitle === "") {
      alert.show("Please enter a stream title");
    } else if (tempStreamDescription === "") {
      alert.show("Please enter a stream description");
    } else {
      handleEditInfoDialogCloseWithEdit();
      if (streamId == undefined) {
        setStreamTitle(tempStreamTitle);
        setStreamDescription(tempStreamDescription);
        setStreamSubscribersOnly(tempStreamSubscribersOnly);
      } else {
        Api.editStreamInfo(streamId, tempStreamTitle, tempStreamDescription)
          .then(() => {
            setStreamTitle(tempStreamTitle);
            setStreamDescription(tempStreamDescription);
          })
          .fail((xhr, status, error) => {
            alert.show(xhr.responseJSON.error);
          });
      }
    }
  }

  function renderContinueDialog() {
    return (
      <Dialog open={showContinueDialog}>
        <DialogContent style={{ display: "flex", flexDirection: "column" }}>
          <b>Stream Title</b>
          <TextField
            id="outlined-multiline-static"
            variant="outlined"
            size="small"
            style={{ width: "400px", marginTop: "13px", marginBottom: "20px" }}
            value={tempStreamTitle}
            onChange={(e) => {
              setTempStreamTitle(e.target.value);
            }}
            autoFocus
            required
          />
          <b>Description</b>
          <TextField
            id="outlined-multiline-static"
            variant="outlined"
            size="small"
            multiline
            rows={4}
            style={{ width: "400px", marginTop: "13px", marginBottom: "20px" }}
            value={tempStreamDescription}
            onChange={(e) => {
              setTempStreamDescription(e.target.value);
            }}
            required
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div>
              <b>Subscriber-only</b>
            </div>
            <div
              style={{
                flexGrow: "1",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Grid
                justify="center"
                component="label"
                container
                alignItems="center"
                spacing={1}
              >
                <Grid item>No</Grid>
                <Grid item>
                  <Switch
                    color="primary"
                    name="subscriberOnly"
                    inputProps={{ "aria-label": "primary checkbox" }}
                    checked={tempStreamSubscribersOnly}
                    onChange={(e) => {
                      setTempStreamSubscribersOnly(e.target.checked);
                    }}
                  />
                </Grid>
                <Grid item>Yes</Grid>
              </Grid>
            </div>
          </div>
          <p>(Only enable stream for subscribers)</p>
        </DialogContent>
        <DialogActions>
          <Button style={{ outline: "none" }} onClick={handleCancelContinue}>
            Cancel
          </Button>
          <ColorButton
            onClick={handleContinue}
            style={{ outline: "none" }}
            color="primary"
            variant="contained"
          >
            Continue
          </ColorButton>
        </DialogActions>
      </Dialog>
    );
  }

  function renderEditInfoDialog() {
    return (
      <Dialog
        open={showEditInfoDialog}
        onClose={handleEditInfoDialogCloseNoEdit}
      >
        <DialogContent style={{ display: "flex", flexDirection: "column" }}>
          <b>Stream Title</b>
          <TextField
            id="outlined-multiline-static"
            variant="outlined"
            size="small"
            style={{ width: "400px", marginTop: "13px", marginBottom: "20px" }}
            value={tempStreamTitle}
            onChange={(e) => {
              setTempStreamTitle(e.target.value);
            }}
            autoFocus
            required
          />
          <b>Description</b>
          <TextField
            id="outlined-multiline-static"
            variant="outlined"
            size="small"
            multiline
            rows={4}
            style={{ width: "400px", marginTop: "13px", marginBottom: "20px" }}
            value={tempStreamDescription}
            onChange={(e) => {
              setTempStreamDescription(e.target.value);
            }}
            required
          />
          {streamId == undefined ? (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>
                  <b>Subscriber-only</b>
                </div>
                <div
                  style={{
                    flexGrow: "1",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Grid
                    justify="center"
                    component="label"
                    container
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid item>No</Grid>
                    <Grid item>
                      <Switch
                        color="primary"
                        name="subscriberOnly"
                        inputProps={{ "aria-label": "primary checkbox" }}
                        checked={tempStreamSubscribersOnly}
                        onChange={(e) => {
                          setTempStreamSubscribersOnly(e.target.checked);
                        }}
                      />
                    </Grid>
                    <Grid item>Yes</Grid>
                  </Grid>
                </div>
              </div>
              <p>(Only enable stream for subscribers)</p>
            </div>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button
            style={{ outline: "none" }}
            onClick={handleEditInfoDialogCloseNoEdit}
          >
            Cancel
          </Button>
          <ColorButton
            onClick={handleEditInfo}
            style={{ outline: "none" }}
            color="primary"
            variant="contained"
          >
            Edit
          </ColorButton>
        </DialogActions>
      </Dialog>
    );
  }

  function renderStartStreamDialog() {
    return (
      <Dialog
        open={showStartStreamDialog}
        onClose={handleStartStreamDialogClose}
        aria-labelledby="confirm-start-stream-dialog-title"
      >
        <DialogTitle id="confirm-start-stream-dialog-title">
          Confirm start stream?
        </DialogTitle>
        <DialogActions>
          <Button
            style={{ outline: "none" }}
            onClick={handleStartStreamDialogClose}
          >
            Cancel
          </Button>
          <ColorButton
            style={{ outline: "none" }}
            onClick={handleStartStream}
            color="primary"
            variant="contained"
          >
            Confirm
          </ColorButton>
        </DialogActions>
      </Dialog>
    );
  }

  function renderEndStreamDialog() {
    return (
      <Dialog
        open={showEndStreamDialog}
        onClose={handleEndStreamDialogClose}
        aria-labelledby="confirm-end-stream-dialog-title"
      >
        <DialogTitle id="confirm-end-stream-dialog-title">
          Confirm end stream?
        </DialogTitle>
        <DialogActions>
          <Button
            style={{ outline: "none" }}
            onClick={handleEndStreamDialogClose}
          >
            Cancel
          </Button>
          <ColorButton
            style={{ outline: "none" }}
            onClick={handleEndStream}
            color="primary"
            variant="contained"
          >
            Confirm
          </ColorButton>
        </DialogActions>
      </Dialog>
    );
  }

  function renderUtilityButtonGroup() {
    if (streamId == undefined) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button
            style={{ height: "40px", width: "160px", outline: "none" }}
            variant="outlined"
            color="primary"
            onClick={handleEditInfoDialogOpen}
          >
            Edit Info
          </Button>
          <ColorButton
            style={{
              height: "40px",
              width: "160px",
              outline: "none",
              marginTop: "10px",
            }}
            color="primary"
            variant="contained"
            onClick={handleStartStreamDialogOpen}
          >
            Start Stream
          </ColorButton>
        </div>
      );
    } else if (streamEnded === false) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button
            style={{ height: "40px", width: "160px", outline: "none" }}
            variant="outlined"
            color="primary"
            onClick={handleEditInfoDialogOpen}
          >
            Edit Info
          </Button>
          <ColorButton
            style={{
              height: "40px",
              width: "160px",
              outline: "none",
              marginTop: "10px",
            }}
            color="primary"
            variant="contained"
            onClick={handleEndStreamDialogOpen}
          >
            End Stream
          </ColorButton>
        </div>
      );
    } else {
      return (
        <div>
          <b>Stream Ended</b>
        </div>
      );
    }
  }

  function renderStreamDashboard(viewers, views, duration) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ color: "#3B21CB", margin: "0px" }}>{viewers}</p>
          <p style={{ fontWeight: "bold", margin: "0px" }}>Viewers</p>
        </div>
        <div
          style={{
            borderLeft: "1px solid gray",
            height: "70%",
            alignSelf: "center",
            marginLeft: "18px",
            marginRight: "18px",
          }}
        ></div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ color: "#3B21CB", margin: "0px" }}>{views}</p>
          <p style={{ fontWeight: "bold", margin: "0px" }}>Views</p>
        </div>
        <div
          style={{
            borderLeft: "1px solid gray",
            height: "70%",
            alignSelf: "center",
            marginLeft: "18px",
            marginRight: "18px",
          }}
        ></div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ color: "#3B21CB", margin: "0px" }}>{duration}</p>
          <p style={{ fontWeight: "bold", margin: "0px" }}>Duration</p>
        </div>
      </div>
    );
  }

  function renderStreamDetails(title, description) {
    if (videoStart === true) {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ display: "flex", flexDirection: "row", marginTop: "18px" }}
          >
            <h5 style={{ margin: "0px" }}>{title}</h5>
            {streamSubscribersOnly === true ? (
              <p
                style={{
                  color: "#3B21CB",
                  fontWeight: "bold",
                  margin: "0px",
                  marginLeft: "18px",
                }}
              >
                Subscribers Only
              </p>
            ) : (
              ""
            )}
          </div>
          <p>{description}</p>
        </div>
      );
    }
  }

  return (
    <div className="content-wrapper">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "18px",
            paddingLeft: "18px",
          }}
        >
          <video height="450px" width="750px" muted ref={videoRef} />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              paddingTop: "8px",
              paddingLeft: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "582px",
              }}
            >
              {renderStreamDashboard(
                1000,
                2000,
                prettyMilliseconds(duration, { colonNotation: true })
              )}
              {renderStreamDetails(streamTitle, streamDescription)}
            </div>
            {renderUtilityButtonGroup()}
          </div>
        </div>
      </div>

      {renderContinueDialog()}
      {renderStartStreamDialog()}
      {renderEndStreamDialog()}
      {renderEditInfoDialog()}
    </div>
  );
}
