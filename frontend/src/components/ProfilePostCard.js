import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import defaultDP from "../assets/Default Dp logo.svg";
import { Link } from "react-router-dom";

export default function ProfilePostCard() {
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
                <i class="fa fa-ellipsis-v float-right" aria-hidden="true"></i>
                <div class="user-block">
                  <img src={defaultDP} alt="User profile picture" />
                  <span class="username">
                    <Link to="/">Teacher A</Link>
                  </span>
                  
                  <span class="description">1 week ago</span>
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