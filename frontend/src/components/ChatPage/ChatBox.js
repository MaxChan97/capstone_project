import React, { useState, useEffect, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import * as dayjs from "dayjs";
import { MessageList, Input } from "react-chat-elements";
import chatSendButton from "../../assets/chatSendButton.png";
import chatSmile from "../../assets/chatSmile.png";
import chatPaperClip from "../../assets/chatPaperClip.png";
import chatMedia from "../../assets/chatMedia.png";
import Api from "../../helpers/Api";
import { db } from "../../firebase";
import { animateScroll } from "react-scroll";

const styles = {
  chat: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    borderWidth: "0px",
    borderColor: "#ccc",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
  },
};

export default function ChatBox({
  selectedChat,
  setSelectedChat,
  currentUser,
  setNewChat,
}) {
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState("");

  const inputRef = useRef("");

  useEffect(() => {
    let messageList = [];
    selectedChat.chatMessages.map((data) => {
      let message = {
        position: data.sender.id === currentUser ? "right" : "left",
        type: "text",
        text: data.body,
        date: dayjs(data.dateTime.slice(0, 24)).toDate(),
      };
      messageList.push(message);
    });
    setMessages(messageList);
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat.id != -1 && getUnreadCount(selectedChat) > 0) {
      Api.setAllMessagesAsOpened(selectedChat.id).done(() => {
        db.collection("ChatRefresh")
          .doc("NtzSzbG7RS66mvutS0kT")
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection("ChatRefresh")
                .doc("NtzSzbG7RS66mvutS0kT")
                .update({ chatRefresh: !doc.data().chatRefresh });
            }
          });
      });
    }
  });

  useEffect(() => {
    scrollToBottomOfChat();
  });

  function getUnreadCount(selectedChat) {
    let unreadCount = 0;
    for (var i = 0; i < selectedChat.chatMessages.length; i++) {
      if (
        selectedChat.chatMessages[i].opened === false &&
        selectedChat.chatMessages[i].recipient.id == currentUser
      ) {
        unreadCount++;
      }
    }
    return unreadCount;
  }

  function scrollToBottomOfChat() {
    animateScroll.scrollToBottom({
      containerId: "Chat",
    });
  }

  function getChatOtherPerson(personList) {
    if (personList[0].id === currentUser) {
      return personList[1];
    } else {
      return personList[0];
    }
  }

  function renderChatHeader() {
    return (
      <AppBar position="static" color="#EAECEF">
        <Toolbar className="ToolBar">
          <Typography variant="h6" color="inherit">
            {getChatOtherPerson(selectedChat.chatParticipants).username}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  function handleSend() {
    if (newText.trim() === "") {
      // do nothing
    } else {
      if (selectedChat.id === -1) {
        // means is a new chat
        Api.createChat(
          currentUser,
          getChatOtherPerson(selectedChat.chatParticipants).id,
          newText
        ).done((createdChat) => {
          setNewText("");
          inputRef.current.clear();
          setSelectedChat(createdChat);
          setNewChat([]);
          db.collection("ChatRefresh")
            .doc("NtzSzbG7RS66mvutS0kT")
            .get()
            .then((doc) => {
              if (doc.exists) {
                db.collection("ChatRefresh")
                  .doc("NtzSzbG7RS66mvutS0kT")
                  .update({ chatRefresh: !doc.data().chatRefresh });
              }
            });
        });
      } else {
        // existing chat
        Api.addMessageToChat(
          selectedChat.id,
          currentUser,
          getChatOtherPerson(selectedChat.chatParticipants).id,
          newText
        ).done(() => {
          setNewText("");
          inputRef.current.clear();
          db.collection("ChatRefresh")
            .doc("NtzSzbG7RS66mvutS0kT")
            .get()
            .then((doc) => {
              if (doc.exists) {
                db.collection("ChatRefresh")
                  .doc("NtzSzbG7RS66mvutS0kT")
                  .update({ chatRefresh: !doc.data().chatRefresh });
              }
            });
        });
      }
    }
  }

  function renderChat() {
    return (
      <div id="Chat" style={{ overflowY: "auto", marginTop: "5px" }}>
        <MessageList
          className="message-list"
          lockable={true}
          dataSource={messages}
        />
      </div>
    );
  }

  function renderChatInput() {
    return (
      <Input
        ref={inputRef}
        placeholder="Type here..."
        onChange={(e) => setNewText(e.target.value)}
        multiline={false}
        autofocus={true}
        rightButtons={
          <Button style={{ outline: "none" }} onClick={handleSend}>
            <img src={chatSendButton} alt="chatSendButton" />
          </Button>
        }
        leftButtons={
          <div>
            <Button style={{ outline: "none" }}>
              <img style={{ height: "23px" }} src={chatSmile} alt="chatSmile" />
            </Button>
            <Button style={{ outline: "none" }}>
              <img
                style={{ height: "23px" }}
                src={chatPaperClip}
                alt="chatPaperClip"
              />
            </Button>
            <Button style={{ outline: "none" }}>
              <img style={{ height: "23px" }} src={chatMedia} alt="chatMedia" />
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <div>
      <div>{renderChatHeader()}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "calc(100vh - 121px)",
        }}
      >
        {renderChat()}
        <div style={{ marginTop: "5px" }}>{renderChatInput()}</div>
      </div>
    </div>
  );
}
