import React, { useEffect, useState } from "react";
import LiveRow from "./LiveRow";

export default function LiveCard({ liveList, searchTerm }) {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // console.log(followingList)
    // const results = followingList.filter(channel =>
    //   channel["publisher"].username.toLowerCase().includes(searchTerm)
    // );
    // setSearchResults(results);
  }, [liveList, searchTerm]);

  return liveList !== undefined ? (
    <div className="card card-primary">
      <div className="card-body">
        <dl>
          <dt className="font-weight-bold" class="text-large">
            Followed users now live
          </dt>
          <dd className="font-weight-normal"> 0 live now</dd>
        </dl>
        <ul class="list-group list-group-flush">
          {searchResults.map((row, index) => {
            return (
              <li key={index} class="list-group-item">
                <LiveRow liveVid={row} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  ) : (
    ""
  );
}
