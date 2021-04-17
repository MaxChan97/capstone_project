import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";
import Api from "../../helpers/Api";
import moment from "moment";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import FileTypes from "../../components/FileTypes.js";
import Poll from "react-polls";
import { useAlert } from "react-alert";
import Tooltip from "@material-ui/core/Tooltip";
import EditPost from "./EditPost";
import ReactHashtag from "react-hashtag";
import { useHistory } from "react-router-dom";

const ITEM_HEIGHT = 30;

export default function ProfilePostForSearch({
  key,
  data,
  refresh,
  setRefresh,
}) {
  let history = useHistory();
  const alert = useAlert();

  //for menu button
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [pollAnswers, setPollAnswers] = useState([]);
  const [votedAnswer, setVotedAnswer] = useState();
  const [pollRefresh, setPollRefresh] = useState(true);

  const [edit, setEdit] = useState(false);
  useEffect(() => {
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

  const [liked, setLiked] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);
  const isAdmin = useSelector((state) => state.isAdmin);

  const handleLike = (event) => {
    Api.likeProfilePost(data.id, currentUser).done(() => {
      setRefresh(!refresh);
      setLiked(true);
    });
  };

  const handleUnlike = (event) => {
    Api.unlikeProfilePost(data.id, currentUser).done(() => {
      setRefresh(!refresh);
      setLiked(false);
    });
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
    if (data) {
      checkedLiked();
      changeDateFormat();
    }
  }, []);

  return data ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
      }}
    >
      <div>
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
        <Link to={"/post/" + data.id}>
          <div class="card">
            <div class="card-body">
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
                      {/* moment(formatDate).format("DD/MM/YYYY hh:mm:ss a") */}
                      {moment.utc(formatDate).fromNow()}
                    </span>
                  </div>
                  {/*
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
                */}
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

                  <span>
                    <Tooltip
                      title="Click to view full post"
                      aria-label="View full post"
                    >
                      <Link
                        to={"/post/" + data.id}
                        style={{ marginLeft: 10, color: "black" }}
                      >
                        <i class="fas fa-comments mr-1"></i>{" "}
                        {data.comments.length}
                      </Link>
                    </Tooltip>
                  </span>
                </p>
              </div>
              {/*
            <MakeCommentCardForFeed
              data={data}
              refresh={refresh}
              setRefresh={setRefresh}
            ></MakeCommentCardForFeed>
            <CommentListForFeed
              comments={data.comments}
              refresh={refresh}
              setRefresh={setRefresh}
              post={data}
            ></CommentListForFeed>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {data.comments.length > 2 ? (
                <Tooltip
                  title="Click to view full post and all comments"
                  aria-label="View full post"
                >
                  <Link
                    to={"/post/" + data.id}
                    style={{
                      color: "#3B21CB",
                      margin: "0, auto",
                      textAlign: "center",
                    }}
                  >
                    View all comments
                  </Link>
                </Tooltip>
              ) : (
                ""
              )}
            </div>
              */}
            </div>
          </div>
        </Link>
      </div>
    </div>
  ) : (
    <p></p>
  );
}
