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
import moment from "moment";
import CircularProgress from '@material-ui/core/CircularProgress'; 

export default function AdminInboxPage() {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.isAdmin);
  const currentUser = useSelector((state) => state.currentUser);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {

    Api.getAdminById(currentUser)
      .done((a) => {
        setAdmin(a);
        console.log(a);
        console.log(a.master);
      })
  }
  const [formatDate, setFormatDate] = useState();
  function changeDateFormat() {
    //remove [UTC] suffix
    var changedDate = admin.createdDate.substring(0, admin.createdDate.length - 5);
    setFormatDate(changedDate);
  }
  /*
  useEffect(() => { 
    console.log(isAdmin);
    console.log(currentUser);
  },[]);
  */
  return isAdmin == true && admin != null ? (
    <div className="content-wrapper">
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-8 mt-3">

          </div>
          <div className="col-md-4 mt-4" style={{ textAlign: "left" }}>
            <div class="callout callout-info" style={{lineHeight: "10px",}}>
              <h5>{admin.username}</h5>
              <p>{admin.email}</p>
              <p>Joined since: {moment(formatDate).format("DD/MM/YYYY")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div style={{ margin: "auto", textAlign: "center" }}>
            <CircularProgress />
            {isAdmin == false ? (<Banned></Banned>) : ("")}
    </div>
  );
}
