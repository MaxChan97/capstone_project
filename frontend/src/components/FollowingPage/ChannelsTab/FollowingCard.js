import React, { useEffect, useState } from "react";
import ChannelRow from "./ChannelRow";

export default function FollowingCard({ followingList, searchTerm }) {

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    console.log(followingList)
    const results = followingList.filter(channel =>
      channel["publisher"].username.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [followingList, searchTerm]);


  return (
    followingList !== undefined ? (
      <div className="card card-primary">
        <div className="card-body">
          <dl>
            <dt className="font-weight-bold" class="text-large">Channels you follow</dt>
            <dd className="font-weight-normal"> You follow {followingList.length} channels</dd>
          </dl>
          <ul class="list-group list-group-flush">
            {searchResults.map((row, index) => {
              return (
                <li key={index} class="list-group-item">
                  <ChannelRow channel={row} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    ) : (""))
}
