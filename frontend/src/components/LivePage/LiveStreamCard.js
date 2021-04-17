import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, Box } from "@material-ui/core";
import LiveStreamCardItem from "./LiveStreamCardItem";
import ReactPaginate from "react-paginate";

const useStyles = makeStyles({
  streamList: {
    display: "flex",
    flexWrap: "wrap",
    overflow: "auto",
  },
  noStreamsText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    color: "grey",
  },
});

export default function LiveStreamCard({
  streamList,
  streamPageCount,
  handleStreamPageClick,
}) {
  const styles = useStyles();

  return streamList && streamList.length > 0 ? (
    <div>
      <GridList
        col={4}
        className={styles.streamList}
        style={{
          justifyContent: "flex-start",
        }}
      >
        {streamList.map((data, idx) => (
          <LiveStreamCardItem key={idx} stream={data} />
        ))}
      </GridList>
      {streamPageCount > 1 ? (
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={streamPageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handleStreamPageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      ) : (
        ""
      )}
    </div>
  ) : (
    <div>
      <h3
        style={{
          color: "gray",
          textAlign: "center",
          margin: "auto",
        }}
      >
        No streams found
      </h3>
    </div>
  );
}
