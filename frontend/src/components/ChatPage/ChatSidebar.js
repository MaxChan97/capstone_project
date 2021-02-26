import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, Paper } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import DefaultDPLogo from "../../assets/Default Dp logo.svg";
import { ChatItem } from "react-chat-elements";
import * as dayjs from "dayjs";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    margin: "auto",
    marginTop: "12px",
    width: 232,
    height: 30,
    backgroundColor: "#EAECEF",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    paddingRight: 0,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    height: "calc(100vh - 95px)",
  },
  channelList: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#7AA18A",
    width: "250px",
    height: "calc(100vh - 95px)",
  },
  channelItemActive: {
    backgroundColor: "#7A9AA1",
  },
  channelText: {
    color: "white",
  },
  chat: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    borderWidth: "1px",
    borderColor: "#ccc",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
  },
  settings: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
};

export default function ChatSidebar({
  currentUser,
  chats,
  newChat,
  selectedChat,
  setSelectedChat,
}) {
  const classes = useStyles();

  function getChatOtherPerson(personList) {
    if (personList[0].id === currentUser) {
      return personList[1];
    } else {
      return personList[0];
    }
  }

  function getMessagePreview(selectedChat) {
    let receivedMessages = [];
    for (var i = 0; i < selectedChat.chatMessages.length; i++) {
      if (selectedChat.chatMessages[i].recipient.id === currentUser) {
        receivedMessages.push(selectedChat.chatMessages[i]);
      }
    }
    if (receivedMessages.length != 0) {
      if (receivedMessages[receivedMessages.length - 1].body.length > 15) {
        let returnString =
          receivedMessages[receivedMessages.length - 1].body.slice(0, 14) +
          "...";
        return returnString;
      }
      return receivedMessages[receivedMessages.length - 1].body;
    }
  }

  function getChatMessageDate(selectedChat) {
    return dayjs(
      selectedChat.chatMessages[
        selectedChat.chatMessages.length - 1
      ].dateTime.slice(0, 24)
    ).toDate();
  }

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

  function renderChannel(data) {
    if (data.id === selectedChat.id) {
      return (
        <div>
          <ChatItem
            avatar={DefaultDPLogo}
            alt={"Profile Picture"}
            title={getChatOtherPerson(data.chatParticipants).username}
            subtitle={getMessagePreview(data)}
            date={getChatMessageDate(data)}
            unread={getUnreadCount(data)}
          />
        </div>
      );
    } else {
      return (
        <div>
          <ChatItem
            avatar={DefaultDPLogo}
            alt={"Profile Picture"}
            title={getChatOtherPerson(data.chatParticipants).username}
            subtitle={getMessagePreview(data)}
            date={getChatMessageDate(data)}
            unread={getUnreadCount(data)}
            onClick={() => setSelectedChat(data)}
          />
        </div>
      );
    }
  }

  function renderNewChatChannel(data) {
    if (data.id === selectedChat.id) {
      return (
        <div>
          <ChatItem
            avatar={DefaultDPLogo}
            alt={"Profile Picture"}
            title={getChatOtherPerson(data.chatParticipants).username}
          />
        </div>
      );
    } else {
      return (
        <div>
          <ChatItem
            avatar={DefaultDPLogo}
            alt={"Profile Picture"}
            title={getChatOtherPerson(data.chatParticipants).username}
            onClick={() => setSelectedChat(data)}
          />
        </div>
      );
    }
  }

  function renderChannels() {
    if (chats != undefined && selectedChat != undefined) {
      return (
        <ul
          className="nav nav-pills nav-sidebar flex-column"
          data-widget="treeview"
          role="menu"
          data-accordion="false"
        >
          {chats.map((data) => renderChannel(data))}
        </ul>
      );
    } else {
      return "";
    }
  }

  function renderNewChat() {
    if (newChat != undefined && selectedChat != undefined) {
      return (
        <ul
          className="nav nav-pills nav-sidebar flex-column"
          data-widget="treeview"
          role="menu"
          data-accordion="false"
        >
          {newChat.map((data) => renderNewChatChannel(data))}
        </ul>
      );
    } else {
      return "";
    }
  }

  return (
    <aside className="main-sidebar sidebar-light-primary elevation-1">
      <h3
        style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "18px" }}
      >
        Chat
      </h3>
      <Paper component="form" className={classes.root}>
        <div
          style={{ outline: "none" }}
          className={classes.iconButton}
          aria-label="search"
        >
          <SearchIcon fontSize="medium" />
        </div>
        <InputBase
          className={classes.input}
          placeholder="Search chats"
          onChange={(e) => {}}
        />
      </Paper>
      <hr style={{ marginTop: "27.5px", marginBottom: "0px" }} />
      <div className="sidebar">
        <nav>
          {renderNewChat()}
          {renderChannels()}
        </nav>
      </div>
    </aside>
  );
}
