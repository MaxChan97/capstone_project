import React from "react";
import defaultDP from "../../assets/Default Dp logo.svg";

export default function ProfileGroup() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "30%",
      }}
    >
      <img style={{ height: "10vh" }} src={defaultDP} alt="defaultDP" />
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
          Teacher A
        </p>
        <p style={{ paddingTop: "2px", color: "#6E757C", fontSize: "15px" }}>
          1,053 followers
        </p>
      </div>
    </div>
  );
}
