/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import defaultDP from "../../assets/Default Dp logo.svg";
// import badge from "../../assets/Videos Streamed Badge.png";

export default function ProfileGroup({
  username,
  numFollowers,
  profilePicture,
  badge,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "30%",
        marginLeft: "20px",
      }}
    >
      <img
        className="rounded-circle"
        style={{ height: "10vh" }}
        src={profilePicture || defaultDP}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "18px",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontWeight: "600",
            marginTop: "5px",
            marginBottom: "0px",
            fontSize: "30px",
          }}
        >
          {username}
        </p>
        <p style={{ paddingTop: "2px", color: "#6E757C", fontSize: "15px" }}>
          {numFollowers} followers
        </p>
      </div>
      <img
        style={{ height: "35px", marginLeft: "20px", marginTop: "-20px" }}
        src={badge}
      />
    </div>
  );
}
