import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MakeCommentCard from "./MakeCommentCard";
import CommentList from "./CommentList";
import { useParams } from "react-router";
import Api from "../../helpers/Api";
import moment from "moment";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import { useAlert } from "react-alert";
import FileTypes from "../../components/FileTypes.js";
import Poll from "react-polls";
import EditPost from "./EditPost";
import ReactHashtag from "react-hashtag";

const ITEM_HEIGHT = 30;

export default function ProfilePostWithComments() {
  //for menu button
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { postId } = useParams();
  const alert = useAlert();
  const [refresh, setRefresh] = useState(true);

  const [pollAnswers, setPollAnswers] = useState([]);
  const [votedAnswer, setVotedAnswer] = useState();
  const [pollRefresh, setPollRefresh] = useState(true);

  const [edit, setEdit] = useState(false);

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

  const [data, setData] = useState();

  function loadData(postId) {
    Api.getPost(postId, false)
      .done((post) => {
        setData(post);
        checkedLiked(post);
        changeDateFormat(post);
      })
      .fail(() => {
        //alert.show("Unable to load post/Post deleted!");
      });
  }

  useEffect(() => {
    if (data != undefined) {
      if (data.poll != undefined) {
        let hasVoted = false;
        for (var i = 0; i < data.poll.pollers.length; i++) {
          if (currentUser === data.poll.pollers[i].id) {
            hasVoted = true;
          }
        }

        if (hasVoted === false) {
          let tempPollAnswer = [];
          for (const [key, value] of Object.entries(data.poll.options)) {
            const pollAnswer = {
              option: key,
              votes: value.numAnswered,
            };
            tempPollAnswer = tempPollAnswer.concat([pollAnswer]);
          }
          setPollAnswers(tempPollAnswer);
        } else {
          // this user has voted alrdy
          let tempPollAnswer = [];
          for (const [key, value] of Object.entries(data.poll.options)) {
            const pollAnswer = {
              option: key,
              votes: value.numAnswered,
            };
            tempPollAnswer = tempPollAnswer.concat([pollAnswer]);
            for (var i = 0; i < value.answeredBy.length; i++) {
              if (value.answeredBy[i].id === currentUser) {
                setVotedAnswer(key);
              }
            }
          }
          setPollAnswers(tempPollAnswer);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    setPollRefresh(!pollRefresh);
  }, [pollAnswers]);

  function handleVote(voteAnswer) {
    Api.voteOnPoll(currentUser, data.poll.id, voteAnswer)
      .done(() => {
        setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

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

  const [liked, setLiked] = useState();

  function checkedLiked(post) {
    post.likes.forEach(function (arrayItem) {
      if (arrayItem.id == currentUser) {
        setLiked(true);
      }
    });
  }

  const currentUser = useSelector((state) => state.currentUser);
  const isAdmin = useSelector((state) => state.isAdmin);

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
        <div class="col-md-9 mt-4" style={{ margin: "auto" }}>
          <DeletePostModal
            show={deletePostModal}
            handleClose={closeDeletePostModal}
            data={data}
            refresh={refresh}
            setRefresh={setRefresh}
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
                      className="rounded-circle"
                      src={data.author.profilePicture || defaultDP}
                    />
                    <Link
                      to={"/profile/" + data.author.id}
                      style={{ marginLeft: 10, color: "#3B21CB" }}
                    >
                      {data.author.username}
                    </Link>
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
                {edit == false ? (
                  <p>{data.body}</p>
                ) : (
                  <EditPost
                    autofocus
                    data={data}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    setEdit={setEdit}
                  ></EditPost>
                )}
                {data.poll != undefined && pollAnswers != [] ? (
                  votedAnswer == undefined ? (
                    <div>
                      <Poll
                        customStyles={{
                          theme: "purple",
                          questionSeparator: true,
                          align: "center",
                          questionColor: "#8f858e",
                        }}
                        question={data.poll.question}
                        noStorage={true}
                        answers={pollAnswers}
                        onVote={handleVote}
                      />
                    </div>
                  ) : (
                    <div>
                      <Poll
                        customStyles={{
                          theme: "purple",
                          questionSeparator: true,
                          align: "center",
                          questionColor: "#8f858e",
                        }}
                        question={data.poll.question}
                        answers={pollAnswers}
                        noStorage={true}
                        vote={votedAnswer}
                      />
                    </div>
                  )
                ) : (
                  ""
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
    <p>Post does not exist</p>
  );
}
