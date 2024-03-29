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
import { logIn, setIsAdmin } from "../redux/actions/index";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";
import loginImage from "../assets/LoginImage.jpg";

const useStyles = makeStyles((theme) => ({
  root: { height: "100vh", overflow: "hidden" },
  image: {
    backgroundRepeat: "no-repeat",
    backgroundColor: "#EBE8FF",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#F5F8F6",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "8%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: "#3B21CB",
    "&:hover": {
      backgroundColor: "#440BD4",
    },
  },
  smalllinks: {
    color: "#3B21CB",
  },
  input: {
    borderColor: "#04005E",
    borderWidth: 1,
    "&:hover": {
      borderColor: "#3B21CB",
      borderWidth: 2,
    },
  },
  login: {
    color: "#3B21CB",
    fontSize: "60px",
  },
  forgetPassword: {
    color: "#04005E",
    position: "relative",
    fontSize: "14px",
    "&:hover": {
      color: "#440BD4",
    },
  },
  createAccount: {
    color: "#04005E",
    position: "relative",
    fontSize: "14px",
    "&:hover": {
      color: "#440BD4",
    },
  },
}));

export default function Login() {
  const alert = useAlert();
  const classes = useStyles();

  const history = useHistory();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    // Enter login logic here
    e.preventDefault();
    Api.login(email, password)
      .done((loggedInPerson) => {
        setEmail("");
        setPassword("");
        dispatch(logIn(loggedInPerson.id));
        dispatch(setIsAdmin(false));
        history.push("/feed");
      })
      .fail((xhr, status, error) => {
        if (xhr.responseJSON.error === "Invalid credentials") {
          alert.show("Invalid credentials, please try again");
        } else if (xhr.responseJSON.error === "Person banned from Login") {
          history.push("/banned");
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
          <h1 className={classes.login}>Login</h1>
          <form
            className={classes.form}
            onSubmit={(e) => {
              handleLogin(e);
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{ outline: "none" }}
            >
              LOGIN
            </Button>
            <Grid container direction="column">
              <Grid item>
                <Link className={classes.forgetPassword} to="/resetPassword">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link className={classes.createAccount} to="/register">
                  {"Don't have an account? Register"}
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
