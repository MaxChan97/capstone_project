import React from "react";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";

export default function ProfileGroup({
  communityName,
  numMembers,
  communityPicture,
  communityId,
}) {
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
      <img
        style={{
          height: 80,
          width: 80,
          borderRadius: "50%",
          display: "block",
          marginLeft:"120px",
          marginRight:"30px",
        }}
        src={communityPicture || defaultDP}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          // marginLeft: "30px",
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
          {communityName}
        </p>

        <Link to ={"/community/" + communityId + "/viewMembers"}>
          {/* <p style={{ paddingTop: "2px", color: "#6E757C", fontSize: "15px" }}> */}
          {numMembers !== 1 ? numMembers + " Members" : numMembers + " Member"}
          {/* </p> */}
        </Link>
      </div>
    </div>
  );
}
