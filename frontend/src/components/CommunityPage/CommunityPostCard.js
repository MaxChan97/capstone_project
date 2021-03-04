import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Api from "../../helpers/Api";
import moment from "moment";
import EditPostModal from "../../components/ProfilePage/EditPostModal";
import DeleteCommPostModal from "../../components/CommunityPage/DeleteCommPostModal"
import FileTypes from "../../components/FileTypes.js";
//import Poll from "react-polls";
import { useAlert } from "react-alert";
const ITEM_HEIGHT = 30;

export default function CommunityPostCard({ key, data, refresh, setRefresh, community }) {
  const alert = useAlert();

  //for menu button
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [pollAnswers, setPollAnswers] = useState([]);
  const [votedAnswer, setVotedAnswer] = useState();

  {/*}
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
              console.log(key);
              setVotedAnswer(key);
            }
          }
        }
        setPollAnswers(tempPollAnswer);
      }
    }
  }, [data, refresh]);

  function handleVote(voteAnswer) {
    Api.voteOnPoll(currentUser, data.poll.id, voteAnswer)
      .done(() => {
        setRefresh(!refresh);
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }
*/}
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
        width: "max-content",
      }}
    >
      <div class="col-md-9">
        
        <DeleteCommPostModal
          show={deletePostModal}
          handleClose={closeDeletePostModal}
          data={data}
          refresh={refresh}
          setRefresh={setRefresh}
          community ={community}
        />
        <EditPostModal
          show={showEditPostModal}
          handleClose={closeEditPostModal}
          data={data}
          refresh={refresh}
          setRefresh={setRefresh}
        />
        
        <div
          class="card"
          style={{
            minWidth: "72ch",
            maxWidth: "72ch",
          }}
        >
          <div class="card-body">
            <div class="post">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <div class="user-block">
                  <img src={defaultDP} alt="User profile picture" />
                  <span class="username">
                    <Link to={"/community/" + community.id} style={{color: "#3B21CB", fontSize:"18px"}} >
                      {community.name}
                    </Link>
                    <span>&nbsp;</span>
                    <span>&nbsp;</span>
                    <span>&nbsp;</span>
                    <Link to={"/profile/" + data.author.id} style={{color: "gray", fontSize:"13px"}}>
                     Posted by @ {data.author.username}
                    </Link>
                  </span>

                  <span class="description">
                    {" "}
                    {moment(formatDate).format("DD/MM/YYYY hh:mm:ss a")}
                    <span>&nbsp; </span>
                    {moment.utc(formatDate).fromNow()}
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
             
              {/*}
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
                      answers={pollAnswers}
                      noStorage={true}
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
            */}
              <p>
                {liked == true ? (
                  <Link onClick={handleUnlike} style={{color: "#3B21CB",}}>
                    <i class="fas fa-thumbs-up mr-1"></i> {data.likes.length}
                  </Link>
                ) : (
                  <Link onClick={handleLike} style={{ color: "black" }}>
                    <i class="fas fa-thumbs-up mr-1"></i> {data.likes.length}
                  </Link>
                )}

                <span>
                  <Link
                    to={"/community/post/" + data.id}
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
