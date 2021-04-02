import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    TextField,
} from "@material-ui/core";

import { useSelector } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Api from "../../helpers/Api";
import { useAlert } from "react-alert";


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

export default function EditComment({
    data,
    refresh,
    setRefresh,
    setEdit,
}) {
    const currentUser = useSelector((state) => state.currentUser);
    const theme = useTheme();
    const alert = useAlert();
    const [post, setPost] = React.useState(data.body);

    const handleEdit = (event) => {
        setPost(event.target.value);
    };

    async function handleCancel() {
        setEdit(false);
    }

    async function handleSubmit() {
        Api.editProfilePostComment(data.id, currentUser, post)
            .done(() => {
                alert.show("Edit success!");
                setRefresh(!refresh);
                setEdit(false);
            })
            .fail((xhr, status, error) => {
                alert.show("Something went wrong, please try again!");
            });
    }

    return (
        <div>

            <TextField
                label="Edit Comment"
                multiline
                value={post}
                onChange={handleEdit}
                fullWidth={true}
                variant="filled"
                style= {{width:"98%"}}
            />
            <br></br>
            <br></br>
            <div style={{ alignItems: "baseline", textAlign:"right"}}>
                <ColorButton
                    style={{
                        outline: "none",
                        marginRight: "3%",
                        backgroundColor: "#FFFFFF",
                        color: "#4A5056",
                    }}
                    variant="contained"
                    color="secondary"
                    type="reset"
                    size="small"
                    onClick={handleCancel}
                >
                    CANCEL
                </ColorButton>
                <span> &nbsp; </span>
                <ColorButton
                    style={{
                        outline: "none",
                        marginRight: "3%",
                        textAlign: "right",
                    }}
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="small"
                    onClick={handleSubmit}
                >
                    Edit
                </ColorButton>
            </div>
        </div>
    );
}
