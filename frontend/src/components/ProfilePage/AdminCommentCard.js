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
import FileTypes from "../../components/FileTypes.js";
import Poll from "react-polls";
import { useAlert } from "react-alert";
import Tooltip from "@material-ui/core/Tooltip";
import ReactHashtag from "react-hashtag";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import AdminDeleteCommentModal from "./AdminDeleteCommentModal";
import error from "../../assets/Error.png";

const ITEM_HEIGHT = 30;

export default function AdminCommentCard() {
    let history = useHistory();
    const { commentId } = useParams();
    const isAdmin = useSelector((state) => state.isAdmin);
    const alert = useAlert();
    const [data, setData] = useState(null);
    const [formatDate, setFormatDate] = useState();
    const [refresh, setRefresh] = useState(false);
    function changeDateFormat(c) {
        //remove [UTC] suffix
        var changedDate = c.datePosted.substring(0, c.datePosted.length - 5);
        setFormatDate(changedDate);
    }
    const [deleted, setDeleted] = React.useState(true);

    useEffect(() => {
        Api.getCommentById(commentId)
            .done((c) => {
                if (c.body == "Commment Deleted") {
                    setDeleted(true);
                } else {
                    setDeleted(false);
                }
                setData(c);
                changeDateFormat(c);
            })
            .fail(() => {
                //alert.show("Unable to load post/Post deleted!");
            });
    }, [refresh]);

    const [deleteCommentModal, setDeleteCommentModal] = React.useState(false);

    function openDeleteCommentModal() {
        setDeleteCommentModal(true);
    }

    function closeDeleteCommentModal() {
        setDeleteCommentModal(false);
        setRefresh(!refresh);
    }

    const handleDelete = () => {
        openDeleteCommentModal();
    };

    return deleted == false && data ? (
        <div className="content-wrapper">
            <AdminDeleteCommentModal
                show={deleteCommentModal}
                handleClose={closeDeleteCommentModal}
                data={data}
                setDeleted={setDeleted}
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                    margin: "auto",
                }}
            >
                <div class="col-md-9 mt-4" style={{ margin: "auto" }}>
                    <div>
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


                                        {isAdmin == true ? (
                                            <div style={{ textAlign: "right" }}>
                                                <Link onClick={handleDelete}>
                                                    <i class='fas fa-trash-alt' style={{ color: "#3B21CB" }}></i>
                                                </Link>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>



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




                                    <p>
                                        <i class="fas fa-thumbs-up mr-1"></i> {data.likes.length}
                                    </p>
                                </div>



                            </div>
                        </div>
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
                    <h3>Comment Deleted!</h3>
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
