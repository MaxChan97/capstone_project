import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useSelector } from "react-redux";
import ChatBox from "../components/ChatPage/ChatBox";
import ChatSidebar from "../components/ChatPage/ChatSidebar";
import Api from "../helpers/Api";
import { useParams } from "react-router";
import "react-chat-elements/dist/main.css";

const styles = {
  container: {
    display: "flex",
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

export default function ChatPage() {
  const [chats, setChats] = useState();
  const [newChat, setNewChat] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chatUser, setChatUser] = useState({});

  const currentUser = useSelector((state) => state.currentUser);

  const { personId } = useParams();

  function getChatOtherPerson(personList) {
    if (personList[0].id === currentUser) {
      return personList[1];
    } else {
      return personList[0];
    }
  }

  function refreshSelectedChat(chats, selectedChat) {
    for (var i = 0; i < chats.length; i++) {
      if (chats[i].id === selectedChat.id) {
        return chats[i];
      }
      return chats[0];
    }
  }

  useEffect(() => {
    // This useEffect sets chats state attribute
    if (currentUser != undefined) {
      Api.getPersonsChat(currentUser)
        .done((chats) => {
          setChats(chats);
          return chats;
        })
        .done((chats) => {
          if (chats.length != 0) {
            if (selectedChat != undefined) {
              let newSelectedChat = refreshSelectedChat(chats, selectedChat);
              setSelectedChat(newSelectedChat);
            } else if (personId != currentUser) {
              // means we have to check and see if got existing chat
              let existingChatId;
              for (var i = 0; i < chats.length; i++) {
                if (
                  getChatOtherPerson(chats[i].chatParticipants).id == personId
                ) {
                  // we found the existing chat
                  existingChatId = chats[i].id;
                  //return chats[i];
                  if (selectedChat == undefined) {
                    setSelectedChat(chats[i]);
                  }
                }
              }
              if (existingChatId == undefined) {
                // we did not find existing chat therefore need create
                let currentPerson;
                let newPerson;
                let newChat;
                Api.getPersonById(currentUser)
                  .done((currentUserEntity) => {
                    currentPerson = currentUserEntity;
                  })
                  .done(() => {
                    Api.getPersonById(personId)
                      .done((userEntity) => {
                        newPerson = userEntity;
                      })
                      .done(() => {
                        newChat = {
                          chatMessages: [],
                          chatParticipants: [currentPerson, newPerson],
                          id: -1,
                        };
                        let newChatInList = [newChat];
                        setNewChat(newChatInList);
                        if (selectedChat == undefined) {
                          setSelectedChat(newChat);
                        }
                      });
                  });
              }
            } else if (selectedChat == undefined) {
              setSelectedChat(chats[0]);
            }
          }
        });
    }
  }, []);

  useEffect(() => {
    // This useEffect sets the chatUser state attribute
    // and adds a non persisted chat empty chat if personId is defined
    if (currentUser != undefined) {
      Api.getPersonById(currentUser).done((currentUserEntity) => {
        setChatUser({
          id: currentUserEntity.id,
          name: currentUserEntity.username,
          avatar: null,
        });
      });
    }
  }, [currentUser]);

  return (
    <div>
      <ChatSidebar
        currentUser={currentUser}
        chats={chats}
        newChat={newChat}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
      <div className="content-wrapper">
        <div>
          <div>
            {selectedChat != undefined ? (
              <div>
                <ChatBox
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  currentUser={currentUser}
                />
              </div>
            ) : (
              <h3
                style={{
                  color: "gray",
                  textAlign: "center",
                  margin: "auto",
                }}
              >
                No messages to show...
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
