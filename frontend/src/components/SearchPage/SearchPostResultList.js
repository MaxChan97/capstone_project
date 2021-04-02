import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem } from "@material-ui/core";
import ProfilePostCard from "../ProfilePage/ProfilePostCard";
import CommunityPostCard from "../CommunityPage/CommunityPostCard";
import ReactPaginate from "react-paginate";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "auto",
  },
  inline: {
    display: "inline",
  },
}));

export default function SearchPostResultList({
  postList,
  postPageCount,
  handlePostPageClick,
  postRefresh,
  setPostRefresh,
}) {
  const classes = useStyles();

  return postList !== undefined ? (
    <div>
      {postList && postList.length > 0 ? (
        <List className={classes.root}>
          {postList.map((data) => (
            <div>

              {data.postCommunity == undefined ? (
                <ProfilePostCard
                  key={data.id}
                  data={data}
                  refresh={postRefresh}
                  setRefresh={setPostRefresh}
                />
              ) : (
                <CommunityPostCard
                  key={data.id}
                  data={data}
                  refresh={postRefresh}
                  setRefresh={setPostRefresh}
                  community={data.postCommunity}
                />
              )}

            </div>
          ))}
        </List>
      ) : (
        <div>
          <h3
            style={{
              color: "gray",
              textAlign: "center",
              margin: "auto",
            }}
          >
            No posts found
          </h3>
        </div>
      )}
      {postPageCount > 1 ? (
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={postPageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePostPageClick}
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
