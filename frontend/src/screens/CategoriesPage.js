import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { logOut } from "../redux/actions/index";
import { useDispatch } from "react-redux";
import TradingViewWidget, { Themes } from "react-tradingview-widget";

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-wrapper">
      <h1>Categories Page</h1>
      <div className="container">
        <div className="row">
          <div className="col-8">
            <TradingViewWidget symbol="BITBAY:BTCUSDT" theme={Themes.DARK} />
          </div>
        </div>
      </div>
    </div>
  );
}
