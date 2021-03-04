import React, { useEffect, useState } from "react";
import defaultDP from "../../../assets/Default Dp logo.svg";
import Api from "../../../helpers/Api";

export default function ChannelRow({ channel }) {
  const publisher = channel["publisher"];

  const [followerList, setFollowerList] = useState([]);

  // Get total num of followers for each channel
  function loadData(publisher) {
    Api.getFollowers(publisher["id"])
      .done((data) => {
        setFollowerList(data);
        console.log(publisher["id"]);
      })
      .fail((xhr, status, error) => {
        if ((xhr, status, error === "Cannot find publisher")) {
          alert.show("publisher not found");
        } else if ((xhr, status, error === "Missing publisher id")) {
          alert.show("The publisher ID is missing");
        }
      });
  }

  useEffect(() => {
    loadData(publisher);
  }, [publisher]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-2">
          <img
            className="img-fluid rounded-circle"
            src={publisher.profilePicture || defaultDP}
          />
        </div>
        <div className="col-md-7">
          <dl>
            <dt className="text-left">
              <a href={"/profile/" + publisher.id} class="link text-dark">
                {publisher.username}
              </a>
            </dt>
            <dd class="text-secondary">
              {followerList.length !== 1
                ? followerList.length + " followers"
                : followerList.length + " follower"}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
