import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";
import Divider from "@material-ui/core/Divider";

export default function EditComment({ personId, refresh, setRefresh }) {
    const alert = useAlert();
    const useStyles = makeStyles((theme) => ({
        root: {
            "& .MuiTextField-root": {
                margin: theme.spacing(1),
            },
        },
    }));

    const ColorButton = withStyles((theme) => ({
        root: {
            color: theme.palette.getContrastText("#3B21CB"),
            backgroundColor: "#3B21CB",
            "&:hover": {
                backgroundColor: "#260eab",
            },
            fontSize: "12px",
        },
    }))(Button);

    const classes = useStyles();

    const handleComment = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //replace with actual api when done
        /*
        Api.createCommentForPerson(personId, comment)
          .done(() => {
            alert.show("Comment successfully created!");
            setComment("");
            setRefresh(!refresh);
          })
          .fail((xhr, status, error) => {
            alert.show("Something went wrong, please try again!");
          });
          */
    };

    //PREPOPULATE WITH ORIGINAL COMMENT
    const [comment, setComment] = React.useState("");

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
            }}
        >
            <Divider variant="fullWidth" component="li" />

            <form
                onSubmit={handleSubmit}
                className={classes.root}
                noValidate
                autoComplete="off"
            >
                <div class="col-md-9">

                    <div class="card-body" style={{
                        minWidth: "80ch",
                        maxWidth: "80ch",
                    }}>

                        <div class="post">

                            <div class="user-block">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <img src={defaultDP} alt="User profile picture" />

                                    <span class="username" style={{ marginLeft: 20 }}>
                                        <div>
                                            <TextField
                                                id="standard-textarea"
                                                multiline
                                                size="small"
                                                value={comment}
                                                onChange={handleComment}
                                            />
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div style={{ alignItems: "baseline" }}>
                                <div style={{ textAlign: "right" }}>
                                    <ColorButton
                                        style={{
                                            outline: "none",
                                            marginRight: "3%",
                                            backgroundColor: "#FFFFFF",
                                            color: "#4A5056"

                                        }}
                                        variant="contained"
                                        color="secondary"
                                        type="reset"
                                        size="small"
                                    >
                                        CANCEL
                                    </ColorButton>
                                    <ColorButton
                                        style={{
                                            outline: "none",
                                            marginRight: "3%",
                                        }}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        size="small"
                                    >
                                        Update
                                    </ColorButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <Divider variant="fullWidth" component="li" />
        </div>
    );
}