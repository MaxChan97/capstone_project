import React, { useState, useEffect, useRef } from "react";
import {
  FixedWrapper,
  Avatar,
  MessageList,
  Message,
  MessageText,
  MessageGroup,
  MessageMedia,
  MessageTitle,
  MessageButton,
  MessageButtons,
  TitleBar,
  TextComposer,
  Row,
  IconButton,
  TextInput,
  SendButton,
} from "@livechat/ui-kit";
import { useSelector } from "react-redux";
import Api from "../../helpers/Api";
import * as dayjs from "dayjs";
import { useAlert } from "react-alert";
import { db } from "../../firebase";
import { liveChatRefreshListener } from "../../helpers/FirebaseApi";

export default function LiveChatBox({ streamId }) {
  const alert = useAlert();
  const currentUser = useSelector((state) => state.currentUser);

  const [liveMessages, setLiveMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const [liveChatRefresh, setLiveChatRefresh] = useState([]);

  useEffect(() => {
    if (streamId != undefined) {
      Api.getLiveChatByStreamId(streamId)
        .then((liveChat) => {
          setLiveMessages(liveChat.liveMessages);
        })
        .fail((xhr, status, error) => {
          alert.show(xhr.responseJSON.error);
        });
    }
  }, [streamId, liveChatRefresh]);

  useEffect(() => {
    const unsubscribe = liveChatRefreshListener(setLiveChatRefresh);
    const test = () => {
      return unsubscribe();
    };
    return test;
  }, []);

  function handleSendMessage() {
    Api.sendLiveChatMessage(streamId, currentUser, messageBody)
      .then(() => {
        setMessageBody("");
        db.collection("LiveChatRefresh")
          .doc("X4YJ3kYqr7S1uK1GGobz")
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection("LiveChatRefresh")
                .doc("X4YJ3kYqr7S1uK1GGobz")
                .update({ liveChatRefresh: !doc.data().liveChatRefresh });
            }
          });
      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }

  function dateParser(dateString) {
    return dayjs(dateString.slice(0, -5)).format("HH:mm");
  }

  function renderMessage(liveMessage, idx) {
    if (liveMessage.sender.id === currentUser) {
      return (
        <Row key={idx} reverse>
          <Avatar imgUrl={liveMessage.sender.profilePicture} />
          <Message
            authorName={liveMessage.sender.username}
            date={dateParser(liveMessage.date)}
            isOwn
          >
            <MessageText>{liveMessage.body}</MessageText>
          </Message>
        </Row>
      );
    } else {
      return (
        <Row key={idx}>
          <Avatar imgUrl={liveMessage.sender.profilePicture} />
          <Message
            authorName={liveMessage.sender.username}
            date={dateParser(liveMessage.date)}
          >
            <MessageText>{liveMessage.body}</MessageText>
          </Message>
        </Row>
      );
    }
  }

  function renderMessages(liveMessages) {
    return liveMessages.map((liveMessage, idx) => {
      return renderMessage(liveMessage, idx);
    });
  }

  return (
    <div style={{ width: "380px", height: 400 }}>
      <TitleBar
        title="Chat"
        style={{
          backgroundColor: "#ffffff",
          color: "black",
          fontSize: "24px",
          paddingTop: "3px",
          paddingBottom: "3px",
        }}
      />
      <hr style={{ borderTop: "1px solid #E9E9E9", margin: 0 }} />
      <MessageList active>{renderMessages(liveMessages)}</MessageList>
      {streamId != undefined ? (
        <TextComposer
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          onSend={handleSendMessage}
        >
          <Row align="center">
            <TextInput fill />
            <SendButton fit />
          </Row>
        </TextComposer>
      ) : (
        <TextComposer
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          active={false}
        >
          <Row align="center">
            <TextInput fill />
            <SendButton fit />
          </Row>
        </TextComposer>
      )}
    </div>
  );
}
