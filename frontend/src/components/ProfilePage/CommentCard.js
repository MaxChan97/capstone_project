import React, { useEffect, useState } from "react";
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
import Divider from "@material-ui/core/Divider";
import Api from "../../helpers/Api";
import moment from 'moment';

const options = ["Edit Comment", "Delete Comment"];

const ITEM_HEIGHT = 30;

export default function CommentCard({ key, data, refresh, setRefresh }) {
  //for menu button
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [showReplies, setShowReplies] = React.useState(false);

  const handleViewHideReplies = () => {
    setShowReplies(!showReplies);
  };

  const [liked, setLiked] = useState();
  const currentUser = useSelector((state) => state.currentUser);

  const handleLike = (event) => {
    Api.likeProfilePostComment(data.id, currentUser)
    setRefresh(!refresh);
    setLiked(true);
  };

  const handleUnlike = (event) => {
    Api.unlikeProfilePostComment(data.id, currentUser)
    setRefresh(!refresh);
    setLiked(false);
  };

  function checkedLiked() {
    data.likes.forEach(function (arrayItem) {
      if (arrayItem.id == currentUser) {
        setLiked(true);
      }
    });
  }

  useEffect(() => {
    if (data) {
      checkedLiked();
    }
  }, []);

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

                <span class="username">

                  <Link to={"/profile/" + data.author.id}>
                    {data.author.username}
                  </Link>

                </span>

                <span class="description"> {moment().calendar(data.datePosted)} <span>&nbsp; </span>
                  {moment().startOf('day').fromNow(data.datePosted)} ago</span>

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

            <p style={{ marginLeft: 10 }}>{data.body}</p>

            <p style={{ marginLeft: 10 }}>
              {liked == true ? (
                <Link onClick={handleUnlike}>
                  <i class="fas fa-thumbs-up mr-1"></i> {data.likes.length}
                </Link>
              ) : (
                  <Link onClick={handleLike} style={{ color: "black" }}>
                    <i class="fas fa-thumbs-up mr-1"></i> {data.likes.length}
                  </Link>
                )}


              <span>

                <i class="fas fa-comments mr-1" style={{color:"black", marginLeft: 10}}></i> {data.replies.length}

              </span>
            </p>
            {showReplies == true ? (
              <div>
                <Link style={{ fontSize: 15 }} onClick={handleViewHideReplies}>Hide replies</Link>
                <Divider variant="middle" />
                <ReplyCommentCard commentData={data} refresh={refresh}
                  setRefresh={setRefresh}></ReplyCommentCard>
              </div>
            ) : (
                <Link style={{ fontSize: 15 }} onClick={handleViewHideReplies}>Reply/View replies</Link>
              )}

            <Divider variant="middle" />
          </div>

        </div>

      </div>
    </div>
  );
}
