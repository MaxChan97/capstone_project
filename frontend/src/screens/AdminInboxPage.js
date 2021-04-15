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
import ReportList from "../components/AdminPage/ReportList";

export default function AdminInboxPage() {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.isAdmin);
  const currentUser = useSelector((state) => state.currentUser);
  const [admin, setAdmin] = useState(null);
  const [pending, setPending] = useState(0);
  const [voided, setVoided] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [list, setList] = useState(null);
  useEffect(() => {
    loadData();
  }, []);

  function loadData() {

    Api.getAdminById(currentUser)
      .done((a) => {
        setAdmin(a);
        changeDateFormat(a)
      })
    Api.getAllReports()
      .done((list) => {
        setList(list);
        countPending(list);
        countVoid(list);
        countResolved(list);
      })
  }
  const [formatDate, setFormatDate] = useState();
  function changeDateFormat(a) {
    //remove [UTC] suffix
    var changedDate = a.createdDate.substring(0, a.createdDate.length - 5);
    setFormatDate(changedDate);
  }

  function countPending(list) {
    var num = 0;
    var i = 0;
    if (list !== null) {
      for (i = 0; i < list.length; i++) {
        if (list[i].reportState == "PENDING") {
          num++;
        }
      }
      setPending(num);
    }
  }
  function countVoid(list) {
    var num = 0;
    var i = 0;
    if (list !== null) {
      for (i = 0; i < list.length; i++) {
        if (list[i].reportState == "VOID") {
          num++;
        }
      }
      setVoided(num);
    }
  }
  function countResolved(list) {
    var num = 0;
    var i = 0;
    if (list !== null) {
      for (i = 0; i < list.length; i++) {
        if (list[i].reportState == "RESOLVED") {
          num++;
        }
      }
      setResolved(num);
    }
  }
  /*
  useEffect(() => { 
    console.log(isAdmin);
    console.log(currentUser);
  },[]);
  */
  return isAdmin == true && admin != null && list != null ? (
    <div className="content-wrapper">
      <div style={{ padding: 20 }}>
        <div class="row">
          <div class="col-lg-3 col-6">

            <div class="small-box" style={{backgroundColor:"#EA3F79"}}>
              <div class="inner">
                <h3 style={{color:"white"}}>{pending}</h3>

                <p style={{color:"white"}}>Pending</p>
              </div>
              <div class="icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>

            </div>
          </div>

          <div class="col-lg-3 col-6">

            <div class="small-box" style={{backgroundColor:"#3B21CB"}}>
              <div class="inner">
                <h3 style={{color:"white"}}>{voided}</h3>

                <p style={{color:"white"}}>Void</p>
              </div>
              <div class="icon" >
                <i class="fas fa-ban"></i>
              </div>

            </div>
          </div>

          <div class="col-lg-3 col-6">

            <div class="small-box bg-info">
              <div class="inner">
                <h3>{resolved}</h3>

                <p>Resolved</p>
              </div>
              <div class="icon">
                <i class="far fa-smile"></i>
              </div>

            </div>
          </div>

          <div class="col-lg-3 col-6">

            <div class="callout callout-info" style={{ lineHeight: "10px", }}>
              <h5 style={{ wordWrap: "break-word" }}>{admin.username}</h5>
              <p style={{ wordWrap: "break-word" }}>{admin.email}</p>
              <p style={{ wordWrap: "break-word" }}>Joined: {moment(formatDate).format("DD/MM/YYYY")}</p>
            </div>
          </div>

        </div>

        <div className="col-md-12 mt-4">
          <ReportList></ReportList>
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
