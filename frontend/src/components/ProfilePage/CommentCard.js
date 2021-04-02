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
import moment from "moment";
import EditCommentModal from "./EditCommentModal";
import DeleteCommentModal from "./DeleteCommentModal";
import { useAlert } from "react-alert";
import EditComment from "./EditComment";

const ITEM_HEIGHT = 30;

export default function CommentCard({ key, data, refresh, setRefresh }) {
  //for menu button
  const [anchorEl, setAnchorEl] = React.useState(null);
  //set to true as it loads slow. will have error for deleted if default false
  const [deleted, setDeleted] = React.useState(true);
  const open = Boolean(anchorEl);
  const alert = useAlert();
  const [edit, setEdit] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEdit(true);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    openDeleteCommentModal();
  };

  const [showEditCommentModal, setShowEditCommentModal] = React.useState(false);

  function openEditCommentModal() {
    setShowEditCommentModal(true);
  }

  function closeEditCommentModal() {
    setShowEditCommentModal(false);
    setRefresh(!refresh);
    setAnchorEl(null);
  }

  const [deleteCommentModal, setDeleteCommentModal] = React.useState(false);

  function openDeleteCommentModal() {
    setDeleteCommentModal(true);
  }

  function closeDeleteCommentModal() {
    setDeleteCommentModal(false);
    setRefresh(!refresh);
    setAnchorEl(null);
  }

  const [showReplies, setShowReplies] = React.useState(false);

  const handleViewHideReplies = () => {
    setShowReplies(!showReplies);
  };

  const [liked, setLiked] = useState();
  const currentUser = useSelector((state) => state.currentUser);
  const isAdmin = useSelector((state) => state.isAdmin);

  const handleLike = (event) => {
    Api.likeProfilePostComment(data.id, currentUser);
    setRefresh(!refresh);
    setLiked(true);
  };

  const handleUnlike = (event) => {
    Api.unlikeProfilePostComment(data.id, currentUser);
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
  const [formatDate, setFormatDate] = useState();
  function changeDateFormat() {
    //remove [UTC] suffix
    var changedDate = data.datePosted.substring(0, data.datePosted.length - 5);
    setFormatDate(changedDate);
  }

  useEffect(() => {
    if (data && data.body == "Commment Deleted") {
      setDeleted(true);
    } else {
      setDeleted(false);
      checkedLiked();
      changeDateFormat();
    }
  }, [refresh]);

  return deleted == false && data ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
      }}
    >
      <div >
        <DeleteCommentModal
          show={deleteCommentModal}
          handleClose={closeDeleteCommentModal}
          data={data}
          setDeleted={setDeleted}
        />
        <EditCommentModal
          show={showEditCommentModal}
          handleClose={closeEditCommentModal}
          data={data}
        />
        <div
          class="card-body"
          style={{marginTop: -30}}
        >
          <div class="post">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <div class="user-block">
                <img
                  className="rounded-circle"
                  src={data.author.profilePicture || defaultDP}
                />

                <span class="username">
                  <Link
                    to={"/profile/" + data.author.id}
                    style={{ color: "#3B21CB" }}
                  >
                    {data.author.username}
                  </Link>
                </span>

                <span class="description">
                  {" "}
                  { /* moment(formatDate).format("DD/MM/YYYY hh:mm:ss a") */}
                
                  {moment.utc(formatDate).fromNow()}
                </span>
              </div>
              {isAdmin == false && data.author.id == currentUser ? (
                <div style={{ textAlign: "right",  }}>
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
                      <div>Edit Comment</div>
                    </MenuItem>
                    <MenuItem value={2} onClick={handleDelete}>
                      <div>Delete Comment</div>
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <span></span>
              )}
            </div>

            {edit == false ? (<p style={{ marginLeft: 10 }}>{data.body}</p>) : <EditComment autofocus data={data}
              refresh={refresh}
              setRefresh={setRefresh}
              setEdit={setEdit}></EditComment>}

            <p style={{ marginLeft: 10 }}>
              {liked == true ? (
                <Link onClick={handleUnlike} style={{ color: "#3B21CB" }}>
                  <i class="fas fa-thumbs-up mr-1"></i> {data.likes.length}
                </Link>
              ) : (
                <Link onClick={handleLike} style={{ color: "black" }}>
                  <i class="fas fa-thumbs-up mr-1"></i> {data.likes.length}
                </Link>
              )}

              <span>
                <i
                  class="fas fa-comments mr-1"
                  style={{ color: "black", marginLeft: 10 }}
                ></i>{" "}
                {data.replies.length}
              </span>
            </p>
            {isAdmin == false && showReplies == true ? (
              <div>
                <Link
                  style={{ fontSize: 15 }}
                  onClick={handleViewHideReplies}
                  style={{ color: "#3B21CB", fontSize: "14px" }}
                >
                  Hide replies
                </Link>
                <Divider variant="middle" />
                <ReplyCommentCard
                  commentData={data}
                  refresh={refresh}
                  setRefresh={setRefresh}
                ></ReplyCommentCard>
              </div>
            ) : (
              ""
            )}

            {isAdmin == false && showReplies == false ? (
              <Link
                style={{ fontSize: 15 }}
                onClick={handleViewHideReplies}
                style={{ color: "#3B21CB", fontSize: "14px" }}
              >
                Reply/View replies
              </Link>
            ) : (
              ""
            )}

            {isAdmin == true && data.replies.length > 0 && showReplies == false ? (
              <Link
                style={{ fontSize: 15 }}
                onClick={handleViewHideReplies}
                style={{ color: "#3B21CB", fontSize: "14px" }}
              >
                View replies
              </Link>
            ) : (
              ""
            )}

            {isAdmin == true &&  showReplies == true ? (
              <div>
                <Link
                  style={{ fontSize: 15 }}
                  onClick={handleViewHideReplies}
                  style={{ color: "#3B21CB", fontSize: "14px" }}
                >
                  Hide replies
                </Link>
                <Divider variant="middle" />
                <ReplyCommentCard
                  commentData={data}
                  refresh={refresh}
                  setRefresh={setRefresh}
                ></ReplyCommentCard>
              </div>
            ) : (
              ""
            )}


            <Divider variant="middle" />
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
