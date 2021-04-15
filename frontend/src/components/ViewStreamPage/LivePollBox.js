import React, { useState, useEffect } from "react";
import Api from "../../helpers/Api";
import { livePollRefreshListener } from "../../helpers/FirebaseApi";
import { db } from "../../firebase";
import Poll from "react-polls";
import { useSelector } from "react-redux";
import { useAlert } from "react-alert";

export default function LivePollBox({ streamId, isKicked }) {
  const alert = useAlert();
  const currentUser = useSelector((state) => state.currentUser);

  const [activePoll, setActivePoll] = useState("");
  const [livePollRefresh, setLivePollRefresh] = useState([]);
  const [pollAnswers, setPollAnswers] = useState([]);
  const [votedAnswer, setVotedAnswer] = useState();
  const [pollRefresh, setPollRefresh] = useState(true);

  useEffect(() => {
    if (streamId != undefined && isKicked === false) {
      Api.getActiveLivePollByStreamId(streamId)
        .then((livePoll) => {
          setActivePoll(livePoll);
          if (livePoll === "") {
            setVotedAnswer(undefined);
            setPollAnswers([]);
          }
          if (livePoll !== "") {
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

  return activePoll !== "" ? (
    votedAnswer == undefined ? (
      <div style={{ width: "380px", marginTop: "108px" }}>
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
      </div>
    ) : (
      <div style={{ width: "380px", marginTop: "108px" }}>
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
      </div>
    )
  ) : (
    ""
  );
}
