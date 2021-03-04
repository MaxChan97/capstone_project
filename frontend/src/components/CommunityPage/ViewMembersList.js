import React, { useEffect, useState } from "react";
import ViewMembersRow from "./ViewMembersRow";

export default function ViewMembersList({
  communityMembers,
  searchTerm,
  refresh,
  setRefresh,
}) {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    console.log(communityMembers);
    const results = communityMembers.filter((member) =>
      member.username.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [communityMembers, searchTerm]);

  return communityMembers !== undefined ? (
    <div className="card card-primary ml-4">
      <ul class="list-group list-group-flush" style={{ display: "block" }}>
        {searchResults.map((row, index) => {
          return (
            <li key={index} class="list-group-item">
              <ViewMembersRow
                member={row}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            </li>
          );
        })}
      </ul>
    </div>
  ) : (
    ""
  );
}
