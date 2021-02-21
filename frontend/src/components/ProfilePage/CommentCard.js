import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MakeCommentCard from "./MakeCommentCard";
import ReplyCommentCard from "./ReplyCommentCard";

const options = ["Edit Comment", "Delete Comment"];

const ITEM_HEIGHT = 30;

export default function CommentCard({ key, data }) {
  //for menu button
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        width: "max-content",
      }}
    >
      <div class="col-md-9">
        <div class="card-body" style={{
          minWidth: "80ch",
          maxWidth: "80ch",
        }}>
          <div class="post">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <div class="user-block">
                <img src={defaultDP} alt="User profile picture" />
                <span class="username"><Link>username</Link></span>
                <span class="description">time</span>
                {/* CAN UNCOMMENT WHEN GOT ACTUAL DATA
                  <span class="username">
                      
                    <Link to={"/profile/" + data.author.id}>
                      {data.author.username}
                    </Link>
                     
                  </span>

                  <span class="description">{data.datePosted}</span>
                   */}
              </div>
              <div style={{ textAlign: "right" }}>
                <IconButton
                  style={{ outline: "none" }}
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: "20ch",
                    },
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option} onClick={handleClose}>
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </div>
            {/*
              <p style={{ marginLeft: 10 }}>{data.body}</p>
            */}
            <p style={{ marginLeft: 10 }}>comment body ps: havent integrate :) </p>
            <p style={{ marginLeft: 10 }}>
              <a href="#" class="link-black text-sm">
                <i class="fas fa-thumbs-up mr-1"></i> 700
                </a>

              <span>
                <a
                  href="#"
                  class="link-black text-sm"
                  style={{ marginLeft: 10 }}
                >
                  <i class="fas fa-comments mr-1"></i> 1000
                  </a>
              </span>
            </p>
            <Link style={{ fontSize: 15 }}>View/Hide replies</Link>
          </div>

          <ReplyCommentCard></ReplyCommentCard>
        </div>

      </div>
    </div>
  );
}
