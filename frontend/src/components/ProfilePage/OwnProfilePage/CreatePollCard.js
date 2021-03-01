import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, IconButton, Paper } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 500,
    backgroundColor: "#FFFFFF",
    boxShadow: "none",
    borderStyle: "",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    marginLeft: "1%",
  },
  closePollIconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function CreatePollCard({
  handleClosePollInput,
  pollQuestion,
  setPollQuestion,
  pollOptions,
  setPollOptions,
}) {
  const classes = useStyles();

  function handleOptionNameChange(id, e) {
    (() => {
      const newPollOptions = pollOptions.map((option, oId) => {
        if (id !== oId) return option;
        return e.target.value;
      });

      setPollOptions(newPollOptions);
    })();
  }

  function handleAddOption() {
    setPollOptions(pollOptions.concat([""]));
  }

  function handleRemoveOption(id) {
    setPollOptions(pollOptions.filter((o, oId) => id !== oId));
  }

  return (
    <div
      class="card-body"
      style={{
        borderStyle: "solid",
        borderRadius: "5px",
        borderColor: "#E9E9E9",
        marginLeft: "10.5%",
        marginRight: "2.6%",
        paddingTop: "1.8%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontWeight: "500", marginBottom: "1.2%" }}>Question</p>
        <IconButton
          onClick={() => handleClosePollInput()}
          style={{
            outline: "none",
            paddingTop: "0px",
            paddingRight: "0px",
            backgroundColor: "transparent",
          }}
          className={classes.closePollIconButton}
          aria-label="search"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <input
        value={pollQuestion}
        onChange={(e) => setPollQuestion(e.target.value)}
        type="text"
        id="inputPollQuestion"
        className="form-control"
        autoFocus={true}
      />
      <p style={{ fontWeight: "500", marginTop: "1.5%", marginBottom: "1.2%" }}>
        Options
      </p>
      {pollOptions.map((option, oId) => (
        <div key={oId}>
          <Paper component="form" className={classes.root}>
            <InputBase
              value={option}
              className="form-control"
              placeholder={`Option ${oId + 1}`}
              onChange={(e) => handleOptionNameChange(oId, e)}
            />
            <IconButton
              style={{ outline: "none" }}
              className={classes.iconButton}
              aria-label="search"
              onClick={() => handleRemoveOption(oId)}
            >
              <CloseIcon />
            </IconButton>
          </Paper>
        </div>
      ))}
      {/*<button
        type="button"
        style={{ outline: "none", width: "20%", padding: "0px" }}
        onClick={() => console.log(pollOptions)}
      >
        click
      </button>*/}
      <Button
        color="primary"
        style={{
          marginTop: "1.5%",
          outline: "none",
          width: "20%",
          padding: "0px",
        }}
        onClick={handleAddOption}
      >
        Add Option
      </Button>
    </div>
  );
}
