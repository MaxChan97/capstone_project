import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";
import { logOut } from "../redux/actions/index";
import LiveStreamCard from "../components/LivePage/LiveStreamCard";
import Api from "../helpers/Api";

export default function LivePage() {
  const [streamList, setStreamList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    Api.getOngoingStreams()
      .then((data) => {
        setStreamList(data);
      })
      .fail((xhr, status, error) => {});
  }

  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div
        style={{
          paddingTop: "18px",
          paddingLeft: "28px",
          paddingRight: "28px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ fontWeight: "bold", textAlign: "left", margin: "0px" }}>
          Live Now
        </h3>
        <div style={{ paddingTop: "20px" }}>
          <LiveStreamCard streamList={streamList} searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}
