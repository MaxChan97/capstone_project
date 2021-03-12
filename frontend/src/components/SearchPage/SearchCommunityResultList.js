import React from "react";
import SearchCommunityResultRow from "./SearchCommunityResultRow";
import ReactPaginate from "react-paginate";

export default function SearchCommunityResultList({
  communityList,
  communityPageCount,
  handleCommunityPageClick,
}) {
  return communityList !== undefined ? (
    <div>
      <div className="card card-primary">
        <div className="card-body">
          {communityList.length != 0 ? (
            <ul class="list-group list-group-flush">
              {communityList.map((row, index) => {
                return (
                  <li key={index} class="list-group-item">
                    <SearchCommunityResultRow community={row} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div>
              <h3
                style={{
                  color: "gray",
                  textAlign: "center",
                  margin: "auto",
                }}
              >
                No communities found
              </h3>
            </div>
          )}
        </div>
      </div>
      {communityPageCount > 1 ? (
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={communityPageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handleCommunityPageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      ) : (
        ""
      )}
    </div>
  ) : null;
}
