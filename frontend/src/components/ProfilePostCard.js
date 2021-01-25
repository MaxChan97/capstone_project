import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import defaultDP from "../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const options = [
  'Edit Post',
  'Delete Post'
];

const ITEM_HEIGHT = 30;

export default function ProfilePostCard() {
  //for menu button
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
        }}
      >
        <div class="col-md-9">
          <div class="card">
            <div class="card-body">

              <div class="post">
                <div style={{ display: "flex", alignItems: "baseline" }}>

                  <div class="user-block">
                    <img src={defaultDP} alt="User profile picture" />
                    <span class="username">
                      <Link to="/">Teacher A</Link>
                    </span>

                    <span class="description">1 week ago</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <IconButton
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
                          width: '20ch',
                        },
                      }}
                    >
                      {options.map((option) => (
                        <MenuItem key={option} selected={option === 'Edit Post'} onClick={handleClose}>
                          {option}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                </div>
                <p>
                  Lorem ipsum represents a long-held tradition for designers,
                  typographers and the like. Some people hate it and argue for
                  its demise, but others ignore the hate as they create awesome
                  tools to help create filler text for everyone from bacon lovers
                  to Charlie Sheen fans.
                </p>

                <p>
                  <a href="#" class="link-black text-sm"><i class="far fa-thumbs-up mr-1"></i> 700</a>

                  <span>
                    <a href="#" class="link-black text-sm" style={{ marginLeft: 10 }}>
                      <i class="far fa-comments mr-1"></i> 1000
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}