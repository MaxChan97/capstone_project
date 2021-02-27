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
import CommentList from "./CommentList";
import Api from "../../helpers/Api";
import moment from "moment";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import FileTypes from "../../components/FileTypes.js";
const ITEM_HEIGHT = 30;

export default function ProfilePostCard({ key, data, refresh, setRefresh }) {
  //for menu button
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    openEditPostModal();
  };

  const handleDelete = () => {
    openDeletePostModal();
  };

  const [showEditPostModal, setShowEditPostModal] = React.useState(false);

  function openEditPostModal() {
    setShowEditPostModal(true);
  }

  function closeEditPostModal() {
    setShowEditPostModal(false);
    setRefresh(!refresh);
    setAnchorEl(null);
  }

  const [deletePostModal, setDeletePostModal] = React.useState(false);

  function openDeletePostModal() {
    setDeletePostModal(true);
  }

  function closeDeletePostModal() {
    setDeletePostModal(false);
    setRefresh(!refresh);
    setAnchorEl(null);
  }

  const [liked, setLiked] = useState();
  const currentUser = useSelector((state) => state.currentUser);

  const handleLike = (event) => {
    Api.likeProfilePost(data.id, currentUser);
    setRefresh(!refresh);
    setLiked(true);
  };

  const handleUnlike = (event) => {
    Api.unlikeProfilePost(data.id, currentUser);
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

  return data ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        width: "max-content",
      }}
    >
      <div class="col-md-9">
        <DeletePostModal
          show={deletePostModal}
          handleClose={closeDeletePostModal}
          data={data}
        />
        <EditPostModal
          show={showEditPostModal}
          handleClose={closeEditPostModal}
          data={data}
        />
        <div
          class="card"
          style={{
            minWidth: "80ch",
            maxWidth: "80ch",
          }}
        >
          <div class="card-body">
            <div class="post">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <div class="user-block">
                  <img src={defaultDP} alt="User profile picture" />
                  <span class="username">
                    <Link to={"/profile/" + data.author.id}>
                      {data.author.username}
                    </Link>
                  </span>

                  <span class="description">
                    {" "}
                    {moment().calendar(data.datePosted)} <span>&nbsp; </span>
                    {moment().startOf("day").fromNow(data.datePosted)} ago
                  </span>
                </div>
                {data.author.id == currentUser ? (
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
                      <MenuItem value={1} onClick={handleEdit}>
                        <div>Edit Post</div>
                      </MenuItem>
                      <MenuItem value={2} onClick={handleDelete}>
                        <div>Delete Post</div>
                      </MenuItem>
                    </Menu>
                  </div>
                ) : (
                  <span></span>
                )}
              </div>
              {data.fileUrl &&
                data.fileName &&
                data.fileType &&
                (data.fileType.split("/")[0] == "image" ? (
                  <img
                    className="mx-auto d-block"
                    width="300"
                    src={data.fileUrl}
                  />
                ) : (
                  <div>
                    <FileTypes data={data.fileName.split(".")[1]}></FileTypes>
                    <p className="text-center font-weight-bold">
                      {data.fileName.split(".")[0]}
                    </p>
                  </div>
                ))}
              <p>{data.body}</p>
              <p>
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
                  <Link
                    to={"/post/" + data.id}
                    style={{ marginLeft: 10, color: "black" }}
                  >
                    <i class="fas fa-comments mr-1"></i> {data.comments.length}
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p></p>
  );
}
