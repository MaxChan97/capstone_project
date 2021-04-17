import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { useParams } from "react-router";
import Api from "../../helpers/Api";
import MakeCommentCard from "../../components/ProfilePage/MakeCommentCard";
import CommentList from "../../components/ProfilePage/CommentList";
import EditPostModal from "../../components/ProfilePage/EditPostModal";
import DeleteCommPostModal from "../../components/CommunityPage/DeleteCommPostModal";
import moment from "moment";
import ReactHashtag from "react-hashtag";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import FileTypes from "../../components/FileTypes.js";
import ReportCommPost from "../../components/CommunityPage/ReportCommPost";
import EditPost from "../../components/ProfilePage/EditPost";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import AdminDeletePostModal from "../../components/ProfilePage/AdminDeletePostModal";
import error from "../../assets/Error.png";

const ITEM_HEIGHT = 30;

export default function CommunityPostWithComments() {
  //for menu button
  let history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { postId } = useParams();
  const alert = useAlert();
  const [refresh, setRefresh] = useState(true);
  const [edit, setEdit] = useState(false);
  const isAdmin = useSelector((state) => state.isAdmin);
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

  const [adminDeletePostModal, setAdminDeletePostModal] = React.useState(false);

  function openAdminDeletePostModal() {
    setAdminDeletePostModal(true);
  }

  function closeAdminDeletePostModal() {
    setAdminDeletePostModal(false);
    setRefresh(!refresh);
  }

  const handleAdminDelete = () => {
    openAdminDeletePostModal();
  };

  const [data, setData] = useState();
  const [liked, setLiked] = useState();

  useEffect(() => {
    if (postId) {
      loadData(postId);
      /*
      data.likes.includes(currentUser) ?(
        setLiked(true)
      ): (setLiked(false))
      */
    }
  }, [postId, refresh]);

  function loadData(postId) {
    Api.getPost(postId, true)
      .done((post) => {
        setData(post);
        checkedLiked(post);
        changeDateFormat(post);
      })
      .fail(() => {
        //alert.show("Unable to load post/Post deleted!");
      });
  }

  function checkedLiked(post) {
    post.likes.forEach(function (arrayItem) {
      if (arrayItem.id == currentUser) {
        setLiked(true);
      }
    });
  }

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

  const [formatDate, setFormatDate] = useState();
  function changeDateFormat(post) {
    //remove [UTC] suffix
    var changedDate = post.datePosted.substring(0, post.datePosted.length - 5);
    setFormatDate(changedDate);
  }

  return data ? (
    <div className="content-wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          margin: "auto",
        }}
      >
        <div class="col-md-9" style={{ paddingTop: "20px", margin: "auto" }}>
        <AdminDeletePostModal
          show={adminDeletePostModal}
          handleClose={closeAdminDeletePostModal}
          data={data}
          refresh={refresh}
          setRefresh={setRefresh}
          community={data.postCommunity}
        />
          <DeleteCommPostModal
            show={deletePostModal}
            handleClose={closeDeletePostModal}
            data={data}
            refresh={refresh}
            setRefresh={setRefresh}
            community={data.postCommunity}
          />
          <EditPostModal
            show={showEditPostModal}
            handleClose={closeEditPostModal}
            data={data}
            refresh={refresh}
            setRefresh={setRefresh}
          />

          <div class="card">
            <div class="card-body">
              <div class="post">
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <div class="user-block">
                    <img
                      src={
                        data.postCommunity.communityProfilePicture || defaultDP
                      }
                    />
                    <span class="username">
                      <Link
                        to={"/community/" + data.postCommunity.id}
                        style={{ color: "#3B21CB", fontSize: "18px" }}
                      >
                        {data.postCommunity.name}
                      </Link>
                      <span>&nbsp;</span>
                      <span>&nbsp;</span>
                      <span>&nbsp;</span>
                      <Link
                        to={"/profile/" + data.author.id}
                        style={{ color: "gray", fontSize: "13px" }}
                      >
                        Posted by @ {data.author.username}
                      </Link>
                    </span>
                    <span class="description">
                      {" "}
                      {/* moment(formatDate).format("DD/MM/YYYY hh:mm:ss a") */}
                      {moment.utc(formatDate).fromNow()}
                    </span>
                  </div>
                  {isAdmin == false && data.author.id == currentUser ? (
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

                  {isAdmin == false && data.author.id != currentUser ? (
                    <div style={{ textAlign: "right" }}>
                      <ReportCommPost data={data}></ReportCommPost>{" "}
                    </div>
                  ) : (
                    ""
                  )}
                  {isAdmin == true ? (
                  <div style={{ textAlign: "right", marginRight:25 }}>
                    <Link onClick={handleAdminDelete}>
                    <i class='fas fa-trash-alt' style={{ color: "#3B21CB" }}></i>
                    </Link>
                  </div>
                ) : (
                  ""
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
                  ) : data.fileType.split("/")[0] == "video" ? (
                    <div className="d-flex justify-content-center">
                      <iframe height="100%" src={data.fileUrl}></iframe>
                    </div>
                  ) : (
                    <div>
                      <FileTypes data={data.fileName.split(".")[1]}></FileTypes>
                      <p className="text-center font-weight-bold">
                        {data.fileName.split(".")[0]}
                      </p>
                    </div>
                  ))}
                {edit == false ? (
                  <p>
                    <ReactHashtag
                      renderHashtag={(hashtagValue) => (
                        <span
                          style={{ color: "#3B21CB", cursor: "pointer" }}
                          onClick={() =>
                            history.push("/trend/" + hashtagValue.slice(1))
                          }
                        >
                          <b>{hashtagValue}</b>
                        </span>
                      )}
                    >
                      {data.body}
                    </ReactHashtag>
                  </p>
                ) : (
                  <EditPost
                    autofocus
                    data={data}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    setEdit={setEdit}
                  ></EditPost>
                )}
                <p>
                  {liked == true ? (
                    <Link onClick={handleUnlike} style={{ color: "#3B21CB" }}>
                      <i class="fas fa-thumbs-up mr-1"></i> {data.likes.length}
                    </Link>
                  ) : (
                    <Link onClick={handleLike} style={{ color: "black" }}>
                      <i class="fas fa-thumbs-up mr-1"></i> {data.likes.length}
                    </Link>
                  )}
                </p>
              </div>
            </div>
            {isAdmin == true ? (
              <div>
                <Divider variant="middle" />
                <Box
                  fontWeight="fontWeightBold"
                  fontSize={13}
                  m={1}
                  style={{ marginLeft: "30px" }}
                >
                  {data.comments.length} Comments
                </Box>
                <Divider variant="middle" />
              </div>
            ) : ("")}
            <MakeCommentCard
              data={data}
              refresh={refresh}
              setRefresh={setRefresh}
            ></MakeCommentCard>

            <CommentList
              comments={data.comments}
              refresh={refresh}
              setRefresh={setRefresh}
            ></CommentList>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="content-wrapper">

    <div
        style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            margin: "auto",
        }}
    >
        <div class="col-md-9 mt-4" style={{ margin: "auto" }}>
            <h3>Post Deleted!</h3>
            <img
                style={{
                    resizeMode: "repeat",
                    height: 350,
                }}
                src={error}
            />
        </div>
    </div>
</div>
  );
}
