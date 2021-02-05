import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import defaultDP from "../../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


export default function CreatePostCard() {

    const useStyles = makeStyles((theme) => ({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '50ch',
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
        },
    }))(Button);

    const classes = useStyles();

    const handlePost = (event) => {
        setPost(event.target.value);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    
    const [post, setPost] = React.useState('');

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
            }}
        >
            <form onSubmit={handleSubmit} className={classes.root} noValidate autoComplete="off">
            <div class="col-md-9">
                <div class="card">
                    <div class="card-body">
                        <div class="post">
                            <div class="user-block" >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <img src={defaultDP} alt="User profile picture" />

                                    <span class="username" style={{ marginLeft: 20 }}>
                                        
                                            <div>
                                                <TextField
                                                    id="standard-textarea"
                                                    placeholder="What's new?"
                                                    multiline
                                                    InputProps={{ disableUnderline: true }}
                                                    value={post}
                                                    onChange={handlePost}
                                                />
                                            </div>
                                       
                                    </span>

                                </div>

                            </div>
                            <div style={{ alignItems: "baseline" }}>
                                <div style={{ textAlign: "left" }}>
                                    <span>
                                        <a href="#" class="link-black text-sm" style={{ marginLeft: 10 }}>
                                            <i class="fas fa-smile-beam"></i>
                                        </a>

                                        <span>
                                            <a
                                                href="#"
                                                class="link-black text-sm"
                                                style={{ marginLeft: 10 }}
                                            >
                                                <i class="fas fa-file-image"></i>
                                            </a>
                                        </span>

                                        <span>
                                            <a
                                                href="#"
                                                class="link-black text-sm"
                                                style={{ marginLeft: 10 }}
                                            >
                                                <i class="fas fa-poll"></i>
                                            </a>
                                        </span>
                                    </span>
                                </div>
                                <div style={{ textAlign: "right" }} >
                                    <ColorButton
                                        style={{
                                            height: "30px",
                                            width: "100px",
                                            outline: "none",
                                            marginRight: "3%",


                                        }}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Share
                                    </ColorButton>
                                </div>


                            </div>
                        </div>

                    </div>

                </div>
            </div>
            </form>
        </div>
    );
}
