import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, Box } from "@material-ui/core";
import VideoCardItem from "./VideoCardItem";
import ReactPaginate from "react-paginate";

const useStyles = makeStyles({
  videoList: {
    display: "flex",
    flexWrap: "wrap",
    overflow: "auto",
  },
  noVideosText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    color: "grey",
  },
});

export default function VideoCard({
  videoList,
  videoPageCount,
  handleVideoPageClick,
}) {
  const styles = useStyles();

  return videoList && videoList.length > 0 ? (
    <div>
      <GridList
        col={4}
        className={styles.videoList}
        style={{
          justifyContent: "flex-start",
        }}
      >
        {videoList.map((data, idx) => (
          <VideoCardItem key={idx} video={data} />
        ))}
      </GridList>
      {videoPageCount > 1 ? (
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={videoPageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handleVideoPageClick}
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
        No videos
      </h3>
    </div>
  );
}
