import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Divider from "@material-ui/core/Divider";
import Api from "../../helpers/Api";
import moment from "moment";
import EditReplyModal from "./EditReplyModal";
import DeleteReplyModal from "./DeleteReplyModal";
import { useAlert } from "react-alert";
import EditReply from "./EditReply";
import ReportReply from "./ReportReply";
import AdminDeleteReplyModal from "./AdminDeleteReplyModal";

const options = ["Edit Reply", "Delete Reply"];

const ITEM_HEIGHT = 30;

export default function ReplyCard({ data, refresh, setRefresh }) {
  //for menu button
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const alert = useAlert();
  const [edit, setEdit] = useState(false);
  //set to true as it loads slow. will have error for deleted if default false
  const [deleted, setDeleted] = React.useState(true);
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

  const [deleteReplyModal, setDeleteReplyModal] = React.useState(false);

  function openDeleteReplyModal() {
    setDeleteReplyModal(true);
  }

  function closeDeleteReplyModal() {
    setDeleteReplyModal(false);
    setRefresh(!refresh);
  }

  const handleAdminDelete = () => {
    openDeleteReplyModal();
  };

  const [liked, setLiked] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);

  const handleLike = (event) => {
    Api.likeProfilePostReply(data.id, currentUser);
    setRefresh(!refresh);
    setLiked(true);
  };

  const handleUnlike = (event) => {
    Api.unlikeProfilePostReply(data.id, currentUser);
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

  const isAdmin = useSelector((state) => state.isAdmin);

  useEffect(() => {
    if (data && data.body == "Reply Deleted") {
      setDeleted(true);
    } else {
      setDeleted(false);
      checkedLiked();
      changeDateFormat();
    }
  }, [refresh]);

  return deleted == false && data.author != undefined ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
      }}
    >
      <div >
        <AdminDeleteReplyModal
          show={deleteReplyModal}
          handleClose={closeDeleteReplyModal}
          data={data}
          setDeleted={setDeleted}
        />
        <DeleteReplyModal
          show={deleteCommentModal}
          handleClose={closeDeleteCommentModal}
          data={data}
          setDeleted={setDeleted}
        />
        <EditReplyModal
          show={showEditCommentModal}
          handleClose={closeEditCommentModal}
          data={data}
        />
        <div
          class="card-body"
          style={{ marginBottom: -40 }}
        >
          <div class="post">
            <Divider variant="middle" />
            <br></br>
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
                  {/* moment(formatDate).format("DD/MM/YYYY hh:mm:ss a") */}

                  {moment.utc(formatDate).fromNow()}
                </span>
              </div>
              {isAdmin == false && data.author.id == currentUser ? (
                <div style={{ textAlign: "right", }}>
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
                      <div>Edit Reply</div>
                    </MenuItem>
                    <MenuItem value={2} onClick={handleDelete}>
                      <div>Delete Reply</div>
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <span></span>
              )}
              {isAdmin == false && data.author.id != currentUser ? (
                <div style={{ textAlign: "right" }}>
                  <ReportReply
                    data={data}
                  ></ReportReply> </div>
              ) : ("")}
              {isAdmin == true ? (
                <div style={{ textAlign: "right", }}>
                  <Link onClick={handleAdminDelete}>
                    <i class='fas fa-trash-alt' style={{ color: "#3B21CB" }}></i>
                  </Link>
                </div>
              ) : (
                ""
              )}
            </div>


            {edit == false ? (<p style={{ marginLeft: 10 }}>{data.body}</p>) : <EditReply autofocus data={data}
              refresh={refresh}
              setRefresh={setRefresh}
              setEdit={setEdit}></EditReply>}
            <p style={{ marginLeft: 10 }}>
              {isAdmin == false && liked == true ? (
                <Link onClick={handleUnlike} style={{ color: "#3B21CB" }}>
                  <i class="fas fa-thumbs-up mr-1"></i> {data.likes.length}
                </Link>
              ) : isAdmin == false && liked == false ? (
                <Link onClick={handleLike} style={{ color: "black" }}>
                  <i class="fas fa-thumbs-up mr-1"></i> {data.likes.length}
                </Link>
              ) : isAdmin == true ? (<span><i class="fas fa-thumbs-up mr-1" style={{ color: "black" }}></i> {data.likes.length}</span>
              ) : ("")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
