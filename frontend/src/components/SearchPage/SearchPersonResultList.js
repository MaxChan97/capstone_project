import React from "react";
import SearchPersonResultRow from "./SearchPersonResultRow";
import ReactPaginate from "react-paginate";

export default function SearchPersonResultList({
  personList,
  personPageCount,
  handlePersonPageClick,
}) {
  return personList !== undefined ? (
    <div>
      <div className="card card-primary">
        <div className="card-body">
          {personList.length != 0 ? (
            <ul class="list-group list-group-flush">
              {personList.map((row, index) => {
                return (
                  <li key={index} class="list-group-item">
                    <SearchPersonResultRow person={row} />
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
                No channels found
              </h3>
            </div>
          )}
        </div>
      </div>
      {personPageCount > 1 ? (
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={personPageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePersonPageClick}
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
