import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";

export default function ViewStreamPage() {
  const { streamId } = useParams();
  const alert = useAlert();

  const [stream, setStream] = useState();

  useEffect(() => {
    loadData(streamId);
  }, []);

  function loadData(streamId) {
    Api.getStreamById(streamId)
      .then((stream) => {
        setStream(stream);
        console.log(stream);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  return stream ? (
    <div className="content-wrapper">
      <h1>{streamId}</h1>
      <iframe
        src={stream.accessUrl}
        width="750px"
        height="450px"
        frameborder="0"
        scrolling="no"
        allowfullscreen="true"
      ></iframe>
    </div>
  ) : (
    ""
  );
}
