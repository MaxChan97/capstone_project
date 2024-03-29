import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import { logIn, setIsAdmin } from "../redux/actions/index";
import loginImage from "../assets/LoginImage.jpg";

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

export default function Register() {
  const alert = useAlert();
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();

  function handleRegister(e) {
    e.preventDefault();
    if (password != confirmPassword) {
      alert.show("Passwords do not match");
    } else {
      Api.createPerson(email, username, password)
        .done((createdPerson) => {
          setEmail("");
          setUsername("");
          setPassword("");
          dispatch(logIn(createdPerson.id));
          dispatch(setIsAdmin(false));
          history.push("/feed");
        })
        .fail((xhr, status, error) => {
          if (xhr.responseJSON.error === "Email taken") {
            setEmail("");
            alert.show("This email is already in use");
          }
          if (xhr.responseJSON.error === "Username taken") {
            setUsername("");
            alert.show("This username is already in use");
          }
        });
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
      <Grid item xs={false} sm={4} md={7} className={classes.image}>
        <div>
          <img
            className="img-fluid"
            src={loginImage}
            style={{ height: "100%" }}
          />
        </div>
      </Grid>
      <Grid
        style={{
          background: "#F5F8F6",
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
            Register
          </h1>
          <form
            className={classes.form}
            onSubmit={(e) => {
              handleRegister(e);
            }}
          >
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
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
              REGISTER
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
