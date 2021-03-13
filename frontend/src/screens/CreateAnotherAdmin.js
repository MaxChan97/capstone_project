import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

export default function CreateAnotherAdmin() {
    const alert = useAlert();
    const classes = useStyles();
    const [refresh, setRefresh] = useState(true);

    const currentUser = useSelector((state) => state.currentUser);


    const ColorButton = withStyles((theme) => ({
        root: {
            color: theme.palette.getContrastText("#3B21CB"),
            backgroundColor: "#3B21CB",
            "&:hover": {
                backgroundColor: "#260eab",
            },
        },
    }))(Button);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username.trim() === "") {
            alert.show("Username cannot be empty");
        } else if (email.trim() === "") {
            alert.show("Email cannot be empty");
        } 

    };

    return (
        <div
            style={{ paddingTop: "24px", paddingLeft: "17px" }}
            className="content-wrapper"
        >
            <div class="col-md-9" style={{ textAlign: "left" }}>
                <div class="card card-primary">
                    <form
                        onSubmit={handleSubmit}
                        className={classes.root}
                        noValidate
                        autoComplete="off"
                    >
                        <div class="card-body">
                            <Box fontWeight="fontWeightBold" fontSize={25}>
                                Create a new admin account
                            </Box>
                            <br></br>
                            <div className="form-group">
                                <label htmlFor="inputUsername">Username</label>
                                <input
                                    type="text"
                                    id="inputUsername"
                                    required
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                />
                                <br></br>
                                <label htmlFor="inputEmail">Email</label>
                                <input
                                    type="email"
                                    id="inputEmail"
                                    required
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                            </div>
                            <br></br>
                            <div style={{ textAlign: "right" }}>
                                <ColorButton
                                    style={{
                                        height: "30px",
                                        width: "100px",
                                        outline: "none",
                                        marginRight: "3%",
                                    }}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    Confirm
                                </ColorButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
