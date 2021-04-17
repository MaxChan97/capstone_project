import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import Api from "../helpers/Api";
import VideoThumbnail from "react-video-thumbnail";
import VideoCard from "../components/LibraryPage/VideoCard";

export default function LibraryPage() {
  const [videoList, setVideoList] = useState();
  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    Api.getPersonsVideos(currentUser)
      .done((videos) => {
        console.log(videos);
        setVideoList(videos);
      })
      .fail((xhr, status, error) => {
        alert(xhr.responseJSON.error);
      });
  }, []);

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div class="container">
        <h3 style={{ fontWeight: "bold" }}>Your videos</h3>
        <div class="row">
          {videoList &&
            videoList.length > 0 &&
            videoList.map(
              (video, index) => (
                <div class="col-4">
                  {console.log(video)}
                  <VideoThumbnail
                    key={index}
                    videoUrl={video.fileUrl}
                    snapshotAtTime={0}
                    width={250}
                    height={188}
                  />
                </div>
              )
              // return <VideoCard key={index} video={video} />;
            )}
        </div>
      </div>
    </div>
  );
}
