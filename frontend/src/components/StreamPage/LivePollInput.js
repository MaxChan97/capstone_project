import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  InputBase,
  IconButton,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/Close";
import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    boxShadow: "none",
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

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#3B21CB",
    "&:hover": {
      backgroundColor: "#260eab",
    },
  },
}))(Button);

export default function LivePollInput({ streamId, streamEnded }) {
  const classes = useStyles();
  const alert = useAlert();

  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [accordionOpen, setAccordionOpen] = useState(false);

  function setToDefault() {
    setPollQuestion("");
    setPollOptions(["", ""]);
  }

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
    <div style={{ width: "380px", marginTop: "108px" }}>
      <Accordion>
        <AccordionSummary
          style={{
            height: "46px",
            minHeight: "38px",
          }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography style={{ fontSize: "18px" }}>Poll</Typography>
        </AccordionSummary>
        <hr style={{ borderTop: "1px solid #E9E9E9", margin: 0 }} />
        <AccordionDetails
          style={{
            paddingTop: "8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p style={{ fontWeight: "500", marginBottom: "1.2%" }}>Question</p>
          <input
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            type="text"
            id="inputPollQuestion"
            className="form-control"
          />
          <p
            style={{
              fontWeight: "500",
              marginTop: "1.5%",
              marginBottom: "1.2%",
            }}
          >
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
          <Button
            color="primary"
            style={{
              marginTop: "1.5%",
              outline: "none",
              width: "100px",
              padding: "0px",
            }}
            onClick={handleAddOption}
          >
            Add Option
          </Button>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignSelf: "flex-end",
            }}
          >
            <Button
              style={{
                height: "28px",
                width: "85px",
                outline: "none",
                fontSize: "12px",
                marginRight: "8px",
              }}
              variant="contained"
              onClick={setToDefault}
            >
              Cancel
            </Button>
            {streamId != undefined && streamEnded === false ? (
              <ColorButton
                style={{
                  height: "28px",
                  width: "108px",
                  outline: "none",
                  fontSize: "12px",
                }}
                color="primary"
                variant="contained"
              >
                Start Poll
              </ColorButton>
            ) : (
              <ColorButton
                style={{
                  height: "28px",
                  width: "108px",
                  outline: "none",
                  fontSize: "12px",
                }}
                color="primary"
                variant="contained"
                disabled={true}
              >
                Start Poll
              </ColorButton>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
