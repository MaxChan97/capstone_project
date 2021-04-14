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
import Api from "../../helpers/Api";
import { livePollRefreshListener } from "../../helpers/FirebaseApi";
import { db } from "../../firebase";
import Poll from "react-polls";
import { useSelector } from "react-redux";

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

const ColorButton2 = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#3B21CB"),
    backgroundColor: "#EA3F79",
    "&:hover": {
      backgroundColor: "#d9004a",
    },
  },
}))(Button);

export default function LivePollInput({ streamId, streamEnded }) {
  const classes = useStyles();
  const alert = useAlert();
  const currentUser = useSelector((state) => state.currentUser);

  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [activePoll, setActivePoll] = useState("");
  const [livePollRefresh, setLivePollRefresh] = useState([]);
  const [pollAnswers, setPollAnswers] = useState([]);
  const [votedAnswer, setVotedAnswer] = useState();
  const [pollRefresh, setPollRefresh] = useState(true);

  useEffect(() => {
    if (streamId != undefined) {
      Api.getActiveLivePollByStreamId(streamId)
        .then((livePoll) => {
          setActivePoll(livePoll);
          if (livePoll === "") {
            setVotedAnswer(undefined);
            setPollAnswers([]);
          }
          if (livePoll != "") {
            let hasVoted = false;
            for (var i = 0; i < livePoll.pollers.length; i++) {
              if (currentUser === livePoll.pollers[i].id) {
                hasVoted = true;
              }
            }

            if (hasVoted === false) {
              let tempPollAnswer = [];
              for (const [key, value] of Object.entries(livePoll.options)) {
                const pollAnswer = {
                  option: key,
                  votes: value.numAnswered,
                };
                tempPollAnswer = tempPollAnswer.concat([pollAnswer]);
              }
              setPollAnswers(tempPollAnswer);
            } else {
              let tempPollAnswer = [];
              for (const [key, value] of Object.entries(livePoll.options)) {
                const pollAnswer = {
                  option: key,
                  votes: value.numAnswered,
                };
                tempPollAnswer = tempPollAnswer.concat([pollAnswer]);
                for (var i = 0; i < value.answeredBy.length; i++) {
                  if (value.answeredBy[i].id === currentUser) {
                    setVotedAnswer(key);
                  }
                }
              }
              setPollAnswers(tempPollAnswer);
            }
          }
        })
        .fail((xhr, status, error) => {
          alert.show(xhr.responseJSON.error);
        });
    }
  }, [streamId, livePollRefresh]);

  useEffect(() => {
    const unsubscribe = livePollRefreshListener(setLivePollRefresh);
    const test = () => {
      return unsubscribe();
    };
    return test;
  }, []);

  useEffect(() => {
    setPollRefresh(!pollRefresh);
  }, [pollAnswers]);

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

  function startPoll() {
    if (pollQuestion.trim() === "") {
      alert.show("Live Poll question cannot be empty");
    } else if (pollOptions.indexOf("") !== -1) {
      alert.show("One of your poll options is empty");
    } else if (pollOptions.length < 2) {
      alert.show("You must have at least 2 poll options");
    } else {
      Api.startLivePoll(streamId, pollQuestion, pollOptions)
        .then(() => {
          db.collection("LivePollRefresh")
            .doc("lkYUyBOGtYH8m57gDXj9")
            .get()
            .then((doc) => {
              if (doc.exists) {
                db.collection("LivePollRefresh")
                  .doc("lkYUyBOGtYH8m57gDXj9")
                  .update({ livePollRefresh: !doc.data().livePollRefresh });
              }
            });
        })
        .fail((xhr, status, error) => {
          alert.show(xhr.responseJSON.error);
        });
    }
  }

  function handleVote(voteAnswer) {
    Api.voteOnLivePoll(activePoll.id, currentUser, voteAnswer)
      .then(() => {
        db.collection("LivePollRefresh")
          .doc("lkYUyBOGtYH8m57gDXj9")
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection("LivePollRefresh")
                .doc("lkYUyBOGtYH8m57gDXj9")
                .update({ livePollRefresh: !doc.data().livePollRefresh });
            }
          });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function endPoll() {
    Api.endLivePoll(activePoll.id)
      .then(() => {
        setToDefault();
        db.collection("LivePollRefresh")
          .doc("lkYUyBOGtYH8m57gDXj9")
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection("LivePollRefresh")
                .doc("lkYUyBOGtYH8m57gDXj9")
                .update({ livePollRefresh: !doc.data().livePollRefresh });
            }
          });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  return activePoll === "" ? (
    <div
      style={{
        width: "380px",
        marginTop: "108px",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
                onClick={startPoll}
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
  ) : votedAnswer == undefined ? (
    <div
      style={{
        width: "380px",
        marginTop: "108px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Poll
        customStyles={{
          theme: "purple",
          questionSeparator: true,
          align: "center",
          questionColor: "#8f858e",
        }}
        question={activePoll.question}
        noStorage={true}
        answers={pollAnswers}
        onVote={handleVote}
      />
      <ColorButton2
        onClick={endPoll}
        style={{ alignSelf: "flex-end", fontSize: "12px", outline: "none" }}
      >
        End Poll
      </ColorButton2>
    </div>
  ) : (
    <div
      style={{
        width: "380px",
        marginTop: "108px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Poll
        customStyles={{
          theme: "purple",
          questionSeparator: true,
          align: "center",
          questionColor: "#8f858e",
        }}
        question={activePoll.question}
        answers={pollAnswers}
        noStorage={true}
        vote={votedAnswer}
      />
      <ColorButton2
        onClick={endPoll}
        style={{ alignSelf: "flex-end", fontSize: "12px", outline: "none" }}
      >
        End Poll
      </ColorButton2>
    </div>
  );
}
