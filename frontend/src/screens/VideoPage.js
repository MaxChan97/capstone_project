import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAlert } from "react-alert";
import Api from "../helpers/Api";
import ReactPlayer from "react-player";

export default function VideoPage() {
  const alert = useAlert();
  const currentUser = useSelector((state) => state.currentUser);
  let { videoId } = useParams();
  const [video, setVideo] = useState();

  useEffect(() => {
    Api.getVideo(videoId)
      .done((video) => {
        console.log(video);
        setVideo(video);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, []);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-12">
            {video && <ReactPlayer url={video.fileUrl} />}
          </div>
        </div>
      </div>
    </div>
  );
}
