import React, { useEffect, useState } from "react";
import FollowerRow from "./FollowerRow";

export default function FollowerCard({ followerList, searchTerm}) {

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    console.log(followerList)
    const results = followerList.filter(follower =>
      follower["follower"].username.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm]);

  return (
    followerList !== undefined ? (
    <div className="card card-primary">
      <div className="card-body">
        <p className="font-weight-bold">Followers</p>

          <p className="font-weight-light"> Number of followers: {followerList.length}</p>
        
        <ul class="list-group list-group-flush">
          {searchResults.map((row, index) => {
            return (
              <li key={index} class="list-group-item">
                <FollowerRow follower={row} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  ) : (""))
}
