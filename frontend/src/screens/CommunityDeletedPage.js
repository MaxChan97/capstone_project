/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import error from "../assets/Error.png";

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText("#3B21CB"),
        backgroundColor: "#3B21CB",
        "&:hover": {
            backgroundColor: "#260eab",
        },
    },
}))(Button);

export default function CommunityDeletedPage() {
    return (
        <div className="content-wrapper">
            <div className="container">
            <div className="row">
                    <h3
                        style={{ margin:"auto", paddingTop:30}}
                    >
                        Community has been deleted.
                    </h3>
                </div>
                <div className="row" style={{paddingTop:20}}>
                    <img
                        style={{
                            resizeMode: "repeat",
                            height: 350,
                            margin:"auto"
                        }}
                        src={error}
                    />
                </div>
                <br></br>
                

            </div>
        </div>

    );
}
