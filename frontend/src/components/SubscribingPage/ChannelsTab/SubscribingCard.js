import React, { useEffect, useState } from "react";
import ChannelRow from "./ChannelRow";

export default function SubscribingCard({ subscribingList, searchTerm }) {

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    console.log(subscribingList)
    const results = subscribingList.filter(channel =>
      channel["publisher"].username.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [subscribingList, searchTerm]);


  return (
    subscribingList !== undefined ? (
      <div className="card card-primary">
        <div className="card-body">
          <dl>
            <dt className="font-weight-bold" class="text-large">Channels you subscribe to</dt>
            <dd className="font-weight-normal"> You subscribe to {subscribingList.length} channels</dd>
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
