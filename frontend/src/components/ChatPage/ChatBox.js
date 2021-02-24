import React, { useState, useEffect } from "react";
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
}) {
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState("");

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
    if (selectedChat.id === -1) {
      // means is a new chat
      Api.createChat(
        currentUser,
        getChatOtherPerson(selectedChat.chatParticipants).id,
        newText
      ).done((createdChat) => {
        setSelectedChat(createdChat);
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
      });
    }
  }

  function renderChat() {
    return (
      <div style={{ overflowY: "auto", marginTop: "5px" }}>
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
        defaultValue={newText}
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
