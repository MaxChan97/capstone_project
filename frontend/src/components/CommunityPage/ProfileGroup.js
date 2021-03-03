import React from "react";

export default function ProfileGroup({
  communityName,
  numMembers,
  communityPicture,
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
          height: 110,
          width: 110,
          borderRadius: "50%",
          display: "block",
        }}
        src={communityPicture}
        alt="communityPicture"
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
          {communityName}
        </p>
        <p style={{ paddingTop: "2px", color: "#6E757C", fontSize: "15px" }}>
          {numMembers !== 1 ? numMembers + " Members" : numMembers + " Member"}
        </p>
      </div>
    </div>
  );
}
