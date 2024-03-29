import React, { useState, useEffect, useRef } from "react";
import LiveChatBox from "../components/StreamPage/LiveChatBox";
import LivePollInput from "../components/StreamPage/LivePollInput";
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
  InputBase,
  Paper,
  Chip,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import { Decoder, Encoder, tools, Reader } from "ts-ebml";
import { storage } from "../firebase";
import { db } from "../firebase";
import { streamRefreshListener } from "../helpers/FirebaseApi";
import ban from "../assets/ban.svg";
import unkick from "../assets/unkick.svg";
import ReactHashtag from "react-hashtag";
import Select from "react-select";
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

const useStyles = makeStyles((theme) => ({
  chip: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    "& > *": {
      marginRight: theme.spacing(0.5),
    },
  },
}));

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

// For kicking and unkicking users
var userToKick;
var userToUnkick;

// For related topics
const topics = [
  { value: "INVESTMENTS", label: "Investments" },
  { value: "STOCKS", label: "Stocks" },
  { value: "SAVINGS", label: "Savings" },
  { value: "CAREER", label: "Career" },
  { value: "ETF", label: "ETF" },
  { value: "ROBOADVISORS", label: "Robo-Advisors" },
  { value: "TRADING", label: "Trading" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "BROKERAGES", label: "Brokerages" },
  { value: "RETIREMENT", label: "Retirement" },
  { value: "SALARY", label: "Salary" },
  { value: "CPF", label: "CPF" },
  { value: "BTO", label: "BTO" },
  { value: "UTILITIES_BILL", label: "Utilities Bill" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "FUTURES", label: "Futures" },
  { value: "CRYPTOCURRENCY", label: "Cryptocurrency" },
  { value: "CREDITCARDS", label: "Credit Cards" },
  { value: "BANKING", label: "Banking" },
  { value: "REITS", label: "REITs" },
  { value: "BLOCKCHAIN", label: "Blockchain" },
];

export default function StreamPage() {
  const alert = useAlert();
  const classes = useStyles();
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
  const [streamRelatedTopics, setStreamRelatedTopics] = useState([]);
  const [streamSubscribersOnly, setStreamSubscribersOnly] = useState(false);
  const [tempStreamTitle, setTempStreamTitle] = useState("");
  const [tempStreamDescription, setTempStreamDescription] = useState("");
  const [tempStreamRelatedTopics, setTempStreamRelatedTopics] = useState([]);
  const [tempStreamSubscribersOnly, setTempStreamSubscribersOnly] = useState(
    false
  );
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [streamEnded, setStreamEnded] = useState(false);
  const [stream, setStream] = useState();
  const [streamRefresh, setStreamRefresh] = useState([]);

  const [
    streamCurrentViewersDialogOpen,
    setStreamCurrentViewersDialogOpen,
  ] = useState(false);
  const [currentViewersSearchTerm, setCurrentViewersSearchTerm] = useState("");

  const [streamViewsDialogOpen, setStreamViewsDialogOpen] = useState(false);
  const [viewsSearchTerm, setViewsSearchTerm] = useState("");

  const [
    streamKickedUsersDialogOpen,
    setStreamKickedUsersDialogOpen,
  ] = useState(false);
  const [kickedUsersSearchTerm, setKickedUsersSearchTerm] = useState("");

  const [confirmKickUserDialogOpen, setConfirmKickUserDialogOpen] = useState(
    false
  );
  const [
    confirmUnkickUserDialogOpen,
    setConfirmUnkickUserDialogOpen,
  ] = useState(false);

  useEffect(() => {
    loadData(streamId);
  }, [streamId, streamRefresh]);

  function loadData(streamId) {
    if (streamId != undefined) {
      Api.getStreamById(streamId)
        .then((stream) => {
          setStream(stream);
        })
        .fail((xhr, status, error) => {
          alert.show(xhr.responseJSON.error);
        });
    }
  }

  useEffect(() => {
    const unsubscribe = streamRefreshListener(setStreamRefresh);
    const test = () => {
      return unsubscribe();
    };
    return test;
  }, []);

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
              thumbnailUrl,
              streamRelatedTopics
            )
              .then((stream) => {
                console.log(stream);
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

  function handleStreamCurrentViewersDialogOpen() {
    setStreamCurrentViewersDialogOpen(true);
  }

  function handleStreamCurrentViewersDialogClose() {
    setCurrentViewersSearchTerm("");
    setStreamCurrentViewersDialogOpen(false);
  }

  function handleStreamViewsDialogOpen() {
    setStreamViewsDialogOpen(true);
  }

  function handleStreamViewsDialogClose() {
    setStreamViewsDialogOpen(false);
  }

  function handleStreamKickedUsersDialogOpen() {
    setStreamKickedUsersDialogOpen(true);
  }

  function handleStreamKickedUsersDialogClose() {
    setStreamKickedUsersDialogOpen(false);
  }

  function handleConfirmKickUserDialogOpen() {
    setConfirmKickUserDialogOpen(true);
  }

  function handleConfirmKickUserDialogClose() {
    setConfirmKickUserDialogOpen(false);
  }

  function handleConfirmUnkickUserDialogOpen() {
    setConfirmUnkickUserDialogOpen(true);
  }

  function handleConfirmUnkickUserDialogClose() {
    setConfirmUnkickUserDialogOpen(false);
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
      setStreamRelatedTopics(tempStreamRelatedTopics);
      console.log(tempStreamRelatedTopics);
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
        db.collection("StreamRefresh")
          .doc("en9EpFajcUExC4dvcF45")
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection("StreamRefresh")
                .doc("en9EpFajcUExC4dvcF45")
                .update({ streamRefresh: !doc.data().streamRefresh });
            }
          });
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
        setStreamRelatedTopics(tempStreamRelatedTopics);
      } else {
        Api.editStreamInfo(
          streamId,
          tempStreamTitle,
          tempStreamDescription,
          tempStreamRelatedTopics
        )
          .then(() => {
            setStreamTitle(tempStreamTitle);
            setStreamDescription(tempStreamDescription);
            setStreamRelatedTopics(tempStreamRelatedTopics);
            db.collection("StreamRefresh")
              .doc("en9EpFajcUExC4dvcF45")
              .get()
              .then((doc) => {
                if (doc.exists) {
                  db.collection("StreamRefresh")
                    .doc("en9EpFajcUExC4dvcF45")
                    .update({ streamRefresh: !doc.data().streamRefresh });
                }
              });
          })
          .fail((xhr, status, error) => {
            alert.show(xhr.responseJSON.error);
          });
      }
    }
  }

  function handleStreamRelatedTopicsChange(selectedOptions) {
    let tempSelectedOptions = [];
    for (var i = 0; i < selectedOptions.length; i++) {
      tempSelectedOptions.push(selectedOptions[i].value);
    }
    setTempStreamRelatedTopics(tempSelectedOptions);
  }

  function toTitleCase(str) {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] =
        frags[i].charAt(0).toUpperCase() + frags[i].substr(1).toLowerCase();
    }
    return frags.join(" ");
  }

  function MakeOption(x) {
    return { value: x, label: toTitleCase(x) };
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
          <b>Related Topics</b>
          <Select
            isMulti
            name="topics"
            options={topics}
            onChange={(selectedOptions) =>
              handleStreamRelatedTopicsChange(selectedOptions)
            }
            className="basic-multi-select"
            classNamePrefix="select"
            style={{ width: "400px", marginTop: "13px", marginBottom: "20px" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "13px",
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
          <b>Related Topics</b>
          <Select
            value={tempStreamRelatedTopics.map((x) => MakeOption(x))}
            isMulti
            name="topics"
            options={topics}
            onChange={(selectedOptions) =>
              handleStreamRelatedTopicsChange(selectedOptions)
            }
            className="basic-multi-select"
            classNamePrefix="select"
            style={{ width: "400px", marginTop: "13px", marginBottom: "20px" }}
          />
          {streamId == undefined ? (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "13px",
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

  function handleKickUser(personId) {
    Api.kickUserFromStream(streamId, personId)
      .then(() => {
        db.collection("StreamRefresh")
          .doc("en9EpFajcUExC4dvcF45")
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection("StreamRefresh")
                .doc("en9EpFajcUExC4dvcF45")
                .update({ streamRefresh: !doc.data().streamRefresh });
            }
          });
        handleConfirmKickUserDialogClose();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function renderConfirmKickUserDialog() {
    if (userToKick != undefined) {
      return (
        <Dialog
          open={confirmKickUserDialogOpen}
          onClose={handleConfirmKickUserDialogClose}
        >
          <DialogTitle>Kick user</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you want to kick {userToKick.username} from your stream?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ outline: "none" }}
              onClick={handleConfirmKickUserDialogClose}
            >
              Cancel
            </Button>
            <ColorButton
              style={{ outline: "none" }}
              onClick={() => handleKickUser(userToKick.id)}
              color="primary"
              variant="contained"
            >
              Confirm
            </ColorButton>
          </DialogActions>
        </Dialog>
      );
    }
  }

  function renderCurrentViewersRow(currentViewer) {
    return (
      <div className="container">
        <div
          className="row"
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="col-md-3">
            <img
              className="img-fluid"
              style={{
                resizeMode: "repeat",
                height: 40,
                width: 40,
                borderRadius: "50%",
                display: "block",
              }}
              src={currentViewer.profilePicture}
              alt="defaultDP"
            />
          </div>
          <div className="col-md-7 mb-1" style={{ fontSize: "18px" }}>
            {currentViewer.username}
          </div>
          <div className="col-md-2">
            <button
              style={{
                height: "25px",
                width: "25px",
                backgroundColor: "transparent",
                borderColor: "transparent",
                outline: "none",
                border: "none",
              }}
              onClick={() => {
                userToKick = currentViewer;
                handleConfirmKickUserDialogOpen();
              }}
            >
              <img
                style={{
                  height: "25px",
                  width: "25px",
                }}
                src={ban}
                alt="banLogo"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderCurrentViewersList() {
    if (stream == undefined) {
      return (
        <h5
          style={{
            color: "gray",
            textAlign: "center",
            margin: "auto",
          }}
        >
          No current viewers
        </h5>
      );
    }
    let searchResults = stream.currentViewers.filter((viewer) =>
      viewer.username.toLowerCase().includes(currentViewersSearchTerm)
    );
    if (searchResults.length != 0) {
      return searchResults.map((row, index) => (
        <li key={index} class="list-group-item">
          {renderCurrentViewersRow(row)}
        </li>
      ));
    } else if (stream.currentViewers.length == 0) {
      return (
        <h5
          style={{
            color: "gray",
            textAlign: "center",
            margin: "auto",
          }}
        >
          No current viewers
        </h5>
      );
    } else {
      return (
        <h5
          style={{
            color: "gray",
            textAlign: "center",
            margin: "auto",
          }}
        >
          No search results for "{currentViewersSearchTerm}"
        </h5>
      );
    }
  }

  function renderStreamCurrentViewersDialog() {
    return (
      <Dialog
        open={streamCurrentViewersDialogOpen}
        onClose={handleStreamCurrentViewersDialogClose}
      >
        <DialogTitle
          style={{
            paddingBottom: "0px",
            paddingLeft: "18px",
          }}
        >
          Current Viewers
        </DialogTitle>
        <div
          className="my-3"
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: "8px",
            paddingLeft: "18px",
            paddingRight: "18px",
            minWidth: "23vw",
          }}
        >
          <Paper
            component="form"
            style={{
              padding: "2px 4px",
              display: "flex",
              alignItems: "flex-start",
              backgroundColor: "#EAECEF",
              marginBottom: "12px",
              width: "200px",
            }}
          >
            <InputBase
              value={currentViewersSearchTerm}
              style={{ marginLeft: "1%", flex: 1 }}
              placeholder="Search current viewers"
              onChange={(e) => {
                setCurrentViewersSearchTerm(e.target.value);
              }}
            />
          </Paper>
          {renderCurrentViewersList()}
        </div>
      </Dialog>
    );
  }

  function renderViewsRow(view) {
    return (
      <div className="container">
        <div
          className="row"
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="col-md-3">
            <img
              className="img-fluid"
              style={{
                resizeMode: "repeat",
                height: 40,
                width: 40,
                borderRadius: "50%",
                display: "block",
              }}
              src={view.profilePicture}
              alt="defaultDP"
            />
          </div>
          <div className="col-md-7 mb-1" style={{ fontSize: "18px" }}>
            {view.username}
          </div>
        </div>
      </div>
    );
  }

  function renderViewsList() {
    if (stream == undefined) {
      return (
        <h5
          style={{
            color: "gray",
            textAlign: "center",
            margin: "auto",
          }}
        >
          No views
        </h5>
      );
    }
    let searchResults = stream.viewers.filter((viewer) =>
      viewer.username.toLowerCase().includes(viewsSearchTerm)
    );
    if (searchResults.length != 0) {
      return searchResults.map((row, index) => (
        <li key={index} class="list-group-item">
          {renderViewsRow(row)}
        </li>
      ));
    } else if (stream.viewers.length == 0) {
      return (
        <h5
          style={{
            color: "gray",
            textAlign: "center",
            margin: "auto",
          }}
        >
          No views
        </h5>
      );
    } else {
      return (
        <h5
          style={{
            color: "gray",
            textAlign: "center",
            margin: "auto",
          }}
        >
          No search results for "{viewsSearchTerm}"
        </h5>
      );
    }
  }

  function renderStreamViewsDialog() {
    return (
      <Dialog
        open={streamViewsDialogOpen}
        onClose={handleStreamViewsDialogClose}
      >
        <DialogTitle
          style={{
            paddingBottom: "0px",
            paddingLeft: "18px",
          }}
        >
          All Views
        </DialogTitle>
        <div
          className="my-3"
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: "8px",
            paddingLeft: "18px",
            paddingRight: "18px",
            minWidth: "23vw",
          }}
        >
          <Paper
            component="form"
            style={{
              padding: "2px 4px",
              display: "flex",
              alignItems: "flex-start",
              backgroundColor: "#EAECEF",
              marginBottom: "12px",
              width: "200px",
            }}
          >
            <InputBase
              value={viewsSearchTerm}
              style={{ marginLeft: "1%", flex: 1 }}
              placeholder="Search views"
              onChange={(e) => {
                setViewsSearchTerm(e.target.value);
              }}
            />
          </Paper>
          {renderViewsList()}
        </div>
      </Dialog>
    );
  }

  function handleUnkickUser(personId) {
    Api.unkickUserFromStream(streamId, personId)
      .then(() => {
        db.collection("StreamRefresh")
          .doc("en9EpFajcUExC4dvcF45")
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection("StreamRefresh")
                .doc("en9EpFajcUExC4dvcF45")
                .update({ streamRefresh: !doc.data().streamRefresh });
            }
          });
        handleConfirmUnkickUserDialogClose();
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function renderConfirmUnkickUserDialog() {
    if (userToUnkick != undefined) {
      return (
        <Dialog
          open={confirmUnkickUserDialogOpen}
          onClose={handleConfirmUnkickUserDialogClose}
        >
          <DialogTitle>Unkick user</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you want to unkick {userToUnkick.username} from your stream?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ outline: "none" }}
              onClick={handleConfirmUnkickUserDialogClose}
            >
              Cancel
            </Button>
            <ColorButton
              style={{ outline: "none" }}
              onClick={() => handleUnkickUser(userToUnkick.id)}
              color="primary"
              variant="contained"
            >
              Confirm
            </ColorButton>
          </DialogActions>
        </Dialog>
      );
    }
  }

  function renderKickedUsersRow(kickedUser) {
    return (
      <div className="container">
        <div
          className="row"
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="col-md-3">
            <img
              className="img-fluid"
              style={{
                resizeMode: "repeat",
                height: 40,
                width: 40,
                borderRadius: "50%",
                display: "block",
              }}
              src={kickedUser.profilePicture}
              alt="defaultDP"
            />
          </div>
          <div className="col-md-7 mb-1" style={{ fontSize: "18px" }}>
            {kickedUser.username}
          </div>
          <div className="col-md-2">
            <button
              style={{
                height: "25px",
                width: "25px",
                backgroundColor: "transparent",
                borderColor: "transparent",
                outline: "none",
                border: "none",
              }}
              onClick={() => {
                userToUnkick = kickedUser;
                handleConfirmUnkickUserDialogOpen();
              }}
            >
              <img
                style={{
                  height: "25px",
                  width: "25px",
                }}
                src={unkick}
                alt="banLogo"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderKickedUsersList() {
    if (stream == undefined) {
      return (
        <h5
          style={{
            color: "gray",
            textAlign: "center",
            margin: "auto",
          }}
        >
          No kicked users
        </h5>
      );
    }
    let searchResults = stream.kickedUsers.filter((kickedUser) =>
      kickedUser.username.toLowerCase().includes(kickedUsersSearchTerm)
    );
    if (searchResults.length != 0) {
      return searchResults.map((row, index) => (
        <li key={index} class="list-group-item">
          {renderKickedUsersRow(row)}
        </li>
      ));
    } else if (stream.kickedUsers.length == 0) {
      return (
        <h5
          style={{
            color: "gray",
            textAlign: "center",
            margin: "auto",
          }}
        >
          No kicked users
        </h5>
      );
    } else {
      return (
        <h5
          style={{
            color: "gray",
            textAlign: "center",
            margin: "auto",
          }}
        >
          No search results for "{kickedUsersSearchTerm}"
        </h5>
      );
    }
  }

  function renderStreamKickedUsersDialog() {
    return (
      <Dialog
        open={streamKickedUsersDialogOpen}
        onClose={handleStreamKickedUsersDialogClose}
      >
        <DialogTitle
          style={{
            paddingBottom: "0px",
            paddingLeft: "18px",
          }}
        >
          Kicked Users
        </DialogTitle>
        <div
          className="my-3"
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: "8px",
            paddingLeft: "18px",
            paddingRight: "18px",
            minWidth: "23vw",
          }}
        >
          <Paper
            component="form"
            style={{
              padding: "2px 4px",
              display: "flex",
              alignItems: "flex-start",
              backgroundColor: "#EAECEF",
              marginBottom: "12px",
              width: "200px",
            }}
          >
            <InputBase
              value={kickedUsersSearchTerm}
              style={{ marginLeft: "1%", flex: 1 }}
              placeholder="Search kicked users"
              onChange={(e) => {
                setKickedUsersSearchTerm(e.target.value);
              }}
            />
          </Paper>
          {renderKickedUsersList()}
        </div>
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

  function renderStreamDashboard(duration) {
    if (stream != undefined) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
            }}
            onClick={handleStreamCurrentViewersDialogOpen}
          >
            <p style={{ color: "#3B21CB", margin: "0px" }}>
              {stream.viewerCount}
            </p>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
            }}
            onClick={handleStreamViewsDialogOpen}
          >
            <p style={{ color: "#3B21CB", margin: "0px" }}>
              {stream.viewers.length}
            </p>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
            }}
            onClick={handleStreamKickedUsersDialogOpen}
          >
            <p style={{ color: "#3B21CB", margin: "0px" }}>
              {stream.kickedUsers.length}
            </p>
            <p style={{ fontWeight: "bold", margin: "0px" }}>Kicked Users</p>
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
    } else {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p style={{ color: "#3B21CB", margin: "0px" }}>0</p>
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
            <p style={{ color: "#3B21CB", margin: "0px" }}>0</p>
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
            <p style={{ color: "#3B21CB", margin: "0px" }}>0</p>
            <p style={{ fontWeight: "bold", margin: "0px" }}>Kicked Users</p>
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
  }

  function renderStreamDetails(title, description, relatedTopics) {
    if (videoStart === true) {
      return (
        <div style={{ display: "flex", flexDirection: "column", width: "90%" }}>
          <div
            style={{ display: "flex", flexDirection: "row", marginTop: "18px" }}
          >
            <h5 style={{ margin: "0px" }}>
              <ReactHashtag
                renderHashtag={(hashtagValue) => (
                  <span style={{ color: "#3B21CB" }}>
                    <b>{hashtagValue}</b>
                  </span>
                )}
              >
                {title}
              </ReactHashtag>
            </h5>
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
          <p>
            <ReactHashtag
              renderHashtag={(hashtagValue) => (
                <span style={{ color: "#3B21CB" }}>
                  <b>{hashtagValue}</b>
                </span>
              )}
            >
              {description}
            </ReactHashtag>
          </p>
          <b>Related Topics</b>
          <div component="ul" className={classes.chip}>
            {relatedTopics.map((topics, index) => (
              <Chip
                label={toTitleCase(topics)}
                key={index}
                style={{ backgroundColor: "#FFFFFF" }}
              />
            ))}
          </div>
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
                prettyMilliseconds(duration, { colonNotation: true })
              )}
              {renderStreamDetails(
                streamTitle,
                streamDescription,
                streamRelatedTopics
              )}
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
            paddingBottom: "18px",
          }}
        >
          <LiveChatBox streamId={streamId} streamEnded={streamEnded} />
          <LivePollInput streamId={streamId} streamEnded={streamEnded} />
        </div>
      </div>

      {renderContinueDialog()}
      {renderStartStreamDialog()}
      {renderEndStreamDialog()}
      {renderEditInfoDialog()}
      {renderStreamCurrentViewersDialog()}
      {renderConfirmKickUserDialog()}
      {renderStreamKickedUsersDialog()}
      {renderConfirmUnkickUserDialog()}
      {renderStreamViewsDialog()}
    </div>
  );
}
