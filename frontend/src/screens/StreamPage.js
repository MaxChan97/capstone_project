import React, { useState, useEffect, useRef } from "react";
import LiveChatBox from "../components/StreamPage/LiveChatBox";
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
import { Decoder, Encoder, tools, Reader } from "ts-ebml";
import { storage } from "../firebase";
var uuid = require("uuid");
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

// Attributes needed for stream
var url = "rtmp://broadcast.api.video/s/d74762c5-c2bd-4408-abe7-17d63b69852d";
var socketio_address = "http://localhost:1437";
var width = 750;
var height = 450;
var frameRate = 15;
var audioBitRate = 22050;

// Setting things up
var socket;
var state = "stop";
var imageCapture;
var recordedChunks = [];
var mediaRecorder;

// api.video stuff
var accessToken;
var expiresIn;
var refreshToken;
var tokenType;
var authorization;
var liveStreamId;
var streamKey;
var accessUrl;

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
    Api.authenticateForApiVideo()
      .then((response) => {
        accessToken = response.access_token;
        expiresIn = response.expires_in;
        refreshToken = response.refresh_token;
        tokenType = response.token_type;
        authorization = tokenType + " " + accessToken;
        console.log(accessToken);
      })
      .catch((err) => {
        console.error(err);
      });
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
      recordedChunks = [];
      stopStream();
      disconnectServer();
      if (liveStreamId != undefined) {
        Api.deleteStreamOnApiVideo(liveStreamId, authorization)
          .then((response) => {})
          .catch((err) => {
            console.error(err);
          });
      }
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
    if (mediaRecorder && mediaRecorder.state != "inactive") {
      mediaRecorder.stop();
    }
  }

  function disconnectServer() {
    if (socket) {
      socket.disconnect();
    }
  }

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
    var options = { mimeType: "video/webm; codecs=vp9" };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        let mediaStreamTrack = stream.getVideoTracks()[0];
        imageCapture = new ImageCapture(mediaStreamTrack);
        showVideo(stream);
        socket.emit("config_rtmpDestination", url);
        socket.emit("start", "start");
        mediaRecorder = new MediaRecorder(stream, options);
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
          recordedChunks.push(e.data);
          state = "start";
          //alert.show("data avail");
        };
      })
      .catch(function (err) {
        //alert.show("error: " + err);
        state = "stop";
      });
  }

  function readAsArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = (ev) => {
        reject(ev.error);
      };
    });
  }

  function injectMetadataAndDownload(blob) {
    const decoder = new Decoder();
    const reader = new Reader();
    reader.logging = false;
    reader.drop_default_duration = false;

    // load webm blob and inject metadata
    readAsArrayBuffer(blob).then((buffer) => {
      const elms = decoder.decode(buffer);
      elms.forEach((elm) => {
        reader.read(elm);
      });
      reader.stop();

      let refinedMetadataBuf = tools.makeMetadataSeekable(
        reader.metadatas,
        reader.duration,
        reader.cues
      );
      let body = buffer.slice(reader.metadataSize);
      let result = new Blob([refinedMetadataBuf, body], { type: blob.type });

      var url = URL.createObjectURL(result);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = streamTitle + ".webm";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  function downloadVideo() {
    var blob = new Blob(recordedChunks, {
      type: "video/webm",
    });
    injectMetadataAndDownload(blob);
  }

  async function takePhotoAndUpload() {
    var imageBlob = await imageCapture.takePhoto();
    imageBlob.lastModifiedDate = new Date();
    imageBlob.name = uuid.v4() + "." + imageBlob.type.split("/")[1];
    const uploadTask = storage
      .ref(`streamThumbnails/${imageBlob.name}`)
      .put(imageBlob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error(error);
      },
      () => {
        storage
          .ref("streamThumbnails")
          .child(imageBlob.name)
          .getDownloadURL()
          .then((thumbnailUrl) => {
            Api.startStream(
              currentUser,
              streamTitle,
              streamDescription,
              streamSubscribersOnly,
              accessUrl,
              thumbnailUrl
            )
              .then((stream) => {
                setStreamId(stream.id);
                setStart(Date.now());
                /*Api.uploadThumbnailOnApiVideo(
                  liveStreamId,
                  authorization,
                  imageBlob.name,
                  imageBlob
                )
                  .then((response) => {
                    console.log(response);
                  })
                  .catch((err) => {
                    console.error(err);
                  });*/
              })
              .fail((xhr, status, error) => {
                alert.show(xhr.responseJSON.error);
              });
          });
      }
    );
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
      Api.createStreamOnApiVideo(tempStreamTitle, authorization)
        .then((response) => {
          url = "rtmp://broadcast.api.video/s/" + response.streamKey;
          liveStreamId = response.liveStreamId;
          streamKey = response.streamKey;
          accessUrl = response.assets.player;
          connectServer();
          requestMedia();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async function handleStartStream() {
    handleStartStreamDialogClose();
    // take photo, upload the photo and put the URL in here
    await takePhotoAndUpload();
  }

  function handleEndStream() {
    handleEndStreamDialogClose();
    clearInterval(window.streamTimer);
    Api.endStream(streamId)
      .then(() => {
        setStreamEnded(true);
        stopStream();
        disconnectServer();
        if (liveStreamId != undefined) {
          Api.deleteStreamOnApiVideo(liveStreamId, authorization)
            .then((response) => {})
            .catch((err) => {
              console.error(err);
            });
        }
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "-40px",
          }}
        >
          <b>Stream Ended</b>
          <ColorButton
            style={{
              height: "40px",
              width: "200px",
              outline: "none",
              marginTop: "10px",
            }}
            color="primary"
            variant="contained"
            onClick={downloadVideo}
          >
            Download Stream
          </ColorButton>
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: "1",
            alignItems: "center",
            paddingTop: "18px",
            paddingRight: "18px",
          }}
        >
          <LiveChatBox />
        </div>
      </div>

      {renderContinueDialog()}
      {renderStartStreamDialog()}
      {renderEndStreamDialog()}
      {renderEditInfoDialog()}
    </div>
  );
}
