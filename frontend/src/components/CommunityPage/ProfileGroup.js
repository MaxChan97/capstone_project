import React from "react";
import defaultDP from "../../assets/Default Dp logo.svg";

export default function ProfileGroup() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-4">
          <img
            className="img-fluid"
            style={{ height: "10vh" }}
            src={defaultDP}
            alt="defaultDP"
          />
        </div>
        <div className="col-sm-8">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontWeight: "600",
                marginTop: "30px",
                marginBottom: "0px",
                fontSize: "30px",
              }}
            >
              React is Fun
            </p>
            <p
              style={{ paddingTop: "2px", color: "#6E757C", fontSize: "15px" }}
            >
              8.9K members
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
