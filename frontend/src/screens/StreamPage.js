import React, { useState, useEffect, useRef } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { io } from "socket.io-client";

export default function StreamPage() {
  const alert = useAlert();
  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    return function cleanup() {
      stopStream();
      disconnectServer();
    };
  });

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
      console.log(e);
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

  function stopStream() {
    mediaRecorder.stop();
  }

  function disconnectServer() {
    socket.disconnect();
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

  connectServer();
  requestMedia();

  return (
    <div className="content-wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Stream Page</h1>
        <video muted ref={videoRef} />
      </div>
    </div>
  );
}
