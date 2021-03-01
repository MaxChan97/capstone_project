import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import { logIn } from "../redux/actions/index";
import emailjs from "emailjs-com";

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

export default function ResetPassword() {
  const alert = useAlert();
  const classes = useStyles();

  const [email, setEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();

  function handleResetPassword(e) {
    e.preventDefault();

    Api.resetPassword(email)
      .done((person) => {
        setEmail(person.email);
        let template_params = {
          to_email: person.email,
          to_name: person.username,
          new_password: person.password,
        };
        emailjs
          .send(
            "service_uxmtj2w",
            "template_nzo4tcx",
            template_params,
            "user_VLkMjCcfGXgz2IkAs0sAL"
          )
          .then(
            function (response) {
              console.log(response.status, response.text);
            },
            function (err) {
              console.log(err);
            }
          );
        alert.show("Password has been resetted!");
        history.push("/");
      })
      .fail((xhr, status, error) => {
        if (xhr.responseJSON.error === "Missing person email") {
          setEmail("");
          alert.show("Email is empty");
        }
        if (xhr.responseJSON.error === "Cannot find person") {
          setEmail("");
          alert.show("Email is not under a registered account");
        }
      });
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
            Reset Password
          </h1>
          <form className={classes.form} onSubmit={handleResetPassword}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
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
