import React, { useEffect, useState } from "react";
import defaultDP from "../../../assets/Default Dp logo.svg";
import Api from "../../../helpers/Api";


export default function VideoRow({ video }) {
  const publisher = video["publisher"]

  const [viewerList, setViewerList] = useState([]);
  // const [publisher, setPublisher] = useState([]);


  // Get total num of followers for each channel
  function loadData(publisher) {
    // Api.getFollowers(publisher["id"])
    //   .done((data) => {
    //     setFollowerList(data);
    //     console.log(publisher["id"])
    //   })
    //   .fail((xhr, status, error) => {
    //     if (xhr, status, error === "Cannot find publisher") {
    //       alert.show("publisher not found");
    //     } else if (xhr, status, error === "Missing publisher id") {
    //       alert.show("The publisher ID is missing");
    //     }
    //   });
  }

  useEffect(() => {
    //   loadData(publisher);
  }, [publisher]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-2">
          <img className="img-fluid" src={publisher.profilePicture} alt="defaultDP" />
        </div>
        <div className="col-md-7">
          <dl>
            <dt className="text-left">username here</dt>
            <dd class="text-secondary"> followers</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
