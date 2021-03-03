import React, { useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
  root: { height: "100vh", overflow: "hidden" },
  image: {
    backgroundRepeat: "no-repeat",
    backgroundColor: "#04005E",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "70%",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    vericalAlign: "middle",
    alignItems: "center",
    background: "#F5F8F6",
    height: "100vh",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "10%",
  },
  submit: {
    marginTop: "6%",
    marginBottom: "2.1%",
    background: "#04005E",
    "&:hover": {
      backgroundColor: "#440BD4",
    },
  },
  smalllinks: {
    color: "#67776D",
  },
  input: {
    borderColor: "#828282",
    borderWidth: 1,
    "&:hover": {
      borderColor: "#828282",
      borderWidth: 2,
    },
  },
  loginLink: {
    color: "#04005E",
    fontSize: "14px",
    "&:hover": {
      color: "#440BD4",
    },
  },
  register: {
    color: "#04005E",
    fontSize: "60px",
  },
}));

export default function NewPassword() {
  const alert = useAlert();
  const classes = useStyles();
  let { resetId } = useParams();

  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const history = useHistory();

  function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword1 == "") {
      alert.show("Please enter a password");
    } else if (newPassword2 == "") {
      alert.show("Please enter a password");
    } else if (newPassword1 === newPassword2) {
      Api.resetPassword(resetId, newPassword1)
        .done((person) => {
          alert.show("Password has been resetted!");
          history.push("/");
          Api.saveResetId(person.email, "");
        })
        .fail((xhr, status, error) => {
          if (xhr.responseJSON.error === "Missing person email") {
            alert.show("Email is empty");
          }
          if (xhr.responseJSON.error === "Cannot find person") {
            alert.show("Email is not under a registered account");
          }
        });
    } else {
      alert.show("Passwords do not match");
    }
  }

  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser !== null) {
    return <Redirect to="/" />;
  }

  return (
    <Grid
      style={{ maxheight: "100%" }}
      container
      component="main"
      className={classes.root}
    >
      <CssBaseline />
      <Grid
        style={{
          background: "#7AA18A",
        }}
        item
        xs={false}
        sm={4}
        md={7}
        className={classes.image}
      />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid
        style={{
          background: "#F5F8F6",
          height: "100vh",
        }}
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
      >
        <div style={{ marginTop: "18%" }} className={classes.paper}>
          <h1
            style={{
              position: "relative",
              top: "30px",
            }}
            className={classes.register}
          >
            New Password
          </h1>
          <form className={classes.form} onSubmit={handleResetPassword}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password1"
              label="New Password"
              type="password"
              id="password1"
              value={newPassword1}
              onChange={(e) => {
                setNewPassword1(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type="password"
              id="password2"
              value={newPassword2}
              onChange={(e) => {
                setNewPassword2(e.target.value);
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{ outline: "none" }}
            >
              RESET PASSWORD
            </Button>
            <Grid container justify="center">
              <Grid item>
                <Link className={classes.loginLink} to="/">
                  {"Already have an account? Login"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}></Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
