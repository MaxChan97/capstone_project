import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Api from "../helpers/Api";
import { logOut } from "../redux/actions/index";
import ReportCard from "../components/AdminPage/ReportCard";
import ReportDetails from "../components/AdminPage/ReportDetails";
import Box from "@material-ui/core/Box";
import SortReportDropdown from "../components/AdminPage/SortReportDropdown";
import Banned from "./AdminBannedAccessPage";

export default function AdminInboxPage() {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.isAdmin);
  const currentUser = useSelector((state) => state.currentUser);

  /*
  useEffect(() => { 
    console.log(isAdmin);
    console.log(currentUser);
  },[]);
  */
  return isAdmin == true ?(
    <div className="content-wrapper">
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-6 mt-3"  style={{margin:"auto"}}>
            <ReportCard></ReportCard>
            <ReportCard></ReportCard>
          </div>
          <div className="col-md-6 mt-4" style={{ textAlign: "left" }}>
            <SortReportDropdown></SortReportDropdown>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Banned></Banned>
  );
}
