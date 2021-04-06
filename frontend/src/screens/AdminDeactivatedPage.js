/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import banned from "../assets/Banned.png";
import BNBLogo from "../assets/BNB Logo.png";
import { Link } from "react-router-dom";

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText("#3B21CB"),
        backgroundColor: "#3B21CB",
        "&:hover": {
            backgroundColor: "#260eab",
        },
    },
}))(Button);

export default function AdminDeactivatedPage() {
    return (
        <div >
            <div style={{ marginTop: "50px", }} >
                <div className="row">
                    <div className="col-md-6 mt-4">
                        <div className="row">
                            <img
                                style={{
                                    height: "100px", display: "flex", marginTop: "70px",
                                    margin: "auto"
                                }}
                                src={BNBLogo}
                                alt="BNB Logo"
                            />
                          
                        </div>
                        <div className="row">
                            <img
                                style={{
                                    resizeMode: "repeat",
                                    height: 450,
                                    marginTop: "50px",
                                    margin: "auto"
                                }}
                                src={banned}
                            />
                        </div>
                    </div>
                    <div className="col-md-5 mt-4 ">
                        <div>
                            <h3 style={{textAlign:"center"}}>You no longer have administrative access to Bull&Bear <i class='fas fa-user-times'></i></h3>
                            <br></br>
    
                            <p>
                                You are seeing this page as your administrative access has been revoked by the master administrator.
                            </p>
                            
                            <p>        
                                We recognise how important it is for Bull&Bear to be a place where people feel empowered
                                to communicate, and we take our role seriously in keeping abuse off our service.
                                That's why we've developed a set of <Link style={{ textDecoration: "underline", color: "#3B21CB",}}>Community Standards</Link> that outline what is and
                                is not allowed on Bull&Bear.
                            </p>
                            <b>Please check your email for more information.</b>
                            <p>
                                Please email <Link style={{ textDecoration: "underline", color: "#3B21CB", }}>bullandbearcapstone@gmail.com</Link> for further clarification.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
