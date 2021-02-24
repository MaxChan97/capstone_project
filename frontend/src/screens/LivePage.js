import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Webcam from "react-webcam";
import UploadFile from "../components/UploadFile.js";

export default function LivePage() {
  const currentUser = useSelector((state) => state.currentUser);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <Webcam /> */}
        <h1>Live Page</h1>
        <UploadFile />
      </div>
    </div>
  );
}
