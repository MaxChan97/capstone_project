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
import { chatRefreshListener } from "../helpers/FirebaseApi";

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
  const [newChat, setNewChat] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [chatRefresh, setChatRefresh] = useState([]);

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
      console.log(chats[i].id);
      console.log(selectedChat.id);
      console.log(chats[i].id === selectedChat.id);
      if (chats[i].id === selectedChat.id) {
        return chats[i];
      }
    }
    return chats[0];
  }

  useEffect(() => {
    // This useEffect sets chats state attribute
    if (currentUser != undefined) {
      Api.getPersonsChat(currentUser)
        .done((chats) => {
          setChats(chats);
          return chats;
        })
        .done((retrievedChats) => {
          if (selectedChat != undefined && selectedChat.id != -1) {
            let newSelectedChat = refreshSelectedChat(
              retrievedChats,
              selectedChat
            );
            setSelectedChat(newSelectedChat);
          } else if (personId != currentUser) {
            // means we have to check and see if got existing chat
            let existingChatId;
            for (var i = 0; i < retrievedChats.length; i++) {
              if (
                getChatOtherPerson(retrievedChats[i].chatParticipants).id ==
                personId
              ) {
                // we found the existing chat
                existingChatId = retrievedChats[i].id;
                //return chats[i];
                if (selectedChat == undefined) {
                  setSelectedChat(retrievedChats[i]);
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
                      let newChatList = [newChat];
                      setNewChat(newChatList);
                      if (selectedChat == undefined) {
                        setSelectedChat(newChat);
                      }
                    });
                });
            }
          } else if (selectedChat == undefined && retrievedChats.length != 0) {
            setSelectedChat(retrievedChats[0]);
          }
        });
    }
  }, [chatRefresh]);

  useEffect(() => {
    const unsubscribe = chatRefreshListener(setChatRefresh);
    const test = () => {
      return unsubscribe();
    };
    return test;
  }, []);

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
                  setNewChat={setNewChat}
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
