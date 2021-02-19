import React, { useState, useEffect } from "react";
import { GiftedChat } from "react-web-gifted-chat";

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
    width: "350px",
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

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState([]);
  const [chatUser, setChatUser] = useState({});

  const currentUser = useSelector((state) => state.currentUser);
}
