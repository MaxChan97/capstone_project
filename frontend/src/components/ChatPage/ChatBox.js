import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
import { storage } from "../../firebase";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import FileTypes from "../../components/FileTypes.js";
var uuid = require("uuid");

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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function ChatBox({
  selectedChat,
  setSelectedChat,
  currentUser,
  setNewChat,
}) {
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [caption, setCaption] = useState("");
  const [open, setOpen] = React.useState(false);
  const [progress, setProgress] = useState(0);

  const inputRef = useRef("");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setFileName("");
    setFileUrl("");
    setFileType("");
    setCaption("");
    setProgress(0);
  };

  const changeFileHandler = (event) => {
    if (event.target.files[0] != undefined) {
      var oldName = event.target.files[0].name;
      setFileName(event.target.files[0].name);
      setFileType(event.target.files[0].type);
      var suffix = oldName.split(".")[1];
      var randomId = uuid.v4();
      var newName = randomId.toString() + "." + suffix;
      const uploadTask = storage
        .ref(`files/${newName}`)
        .put(event.target.files[0]);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("files")
            .child(newName)
            .getDownloadURL()
            .then((url) => {
              setFileUrl(url);
            });
          handleClickOpen();
        }
      );
    }
  };

  useEffect(() => {
    let messageList = [];
    selectedChat.chatMessages.map((data) => {
      if (
        data.fileName == null ||
        data.fileUrl == null ||
        data.fileType == null
      ) {
        let message = {
          position: data.sender.id === currentUser ? "right" : "left",
          type: "text",
          text: data.body,
          date: dayjs(data.dateTime.slice(0, -5)).toDate(),
        };
        messageList.push(message);
      } else {
        // got file in this msg
        let MIMEPrefix = data.fileType.split("/")[0];
        if (MIMEPrefix === "image") {
          let message = {
            position: data.sender.id === currentUser ? "right" : "left",
            type: "photo",
            text: data.body,
            date: dayjs(data.dateTime.slice(0, 24)).toDate(),
            data: {
              uri: data.fileUrl,
              status: { click: false, loading: 0 },
              MIMEPrefix: MIMEPrefix,
            },
          };
          messageList.push(message);
        } else if (MIMEPrefix === "video") {
          let message = {
            position: data.sender.id === currentUser ? "right" : "left",
            type: "video",
            text: data.body,
            date: dayjs(data.dateTime.slice(0, 24)).toDate(),
            data: {
              uri: data.fileUrl,
              status: { click: false, loading: 0 },
              MIMEPrefix: MIMEPrefix,
            },
          };
          messageList.push(message);
        } else if (MIMEPrefix === "audio") {
          let message = {
            position: data.sender.id === currentUser ? "right" : "left",
            type: "audio",
            text: data.body,
            date: dayjs(data.dateTime.slice(0, 24)).toDate(),
            data: {
              uri: data.fileUrl,
              status: { click: false, loading: 0 },
              MIMEPrefix: MIMEPrefix,
            },
          };
          messageList.push(message);
        } else {
          let message = {
            position: data.sender.id === currentUser ? "right" : "left",
            type: "file",
            text: data.body,
            date: dayjs(data.dateTime.slice(0, 24)).toDate(),
            data: {
              uri: data.fileUrl,
              status: { click: false, loading: 0 },
              MIMEPrefix: MIMEPrefix,
            },
          };
          messageList.push(message);
        }
      }
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
          <Link
            style={{ color: "inherit" }}
            to={
              "/profile/" + getChatOtherPerson(selectedChat.chatParticipants).id
            }
          >
            <Typography variant="h6" color="inherit">
              {getChatOtherPerson(selectedChat.chatParticipants).username}
            </Typography>
          </Link>
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

  function handleFileSend() {
    if (selectedChat.id === -1) {
      // means is a new chat
      Api.createFileChat(
        currentUser,
        getChatOtherPerson(selectedChat.chatParticipants).id,
        caption,
        fileName,
        fileUrl,
        fileType
      ).done((createdChat) => {
        // setNewText("");
        // inputRef.current.clear();
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
        handleClose();
      });
    } else {
      // existing chat
      Api.addFileToChat(
        selectedChat.id,
        currentUser,
        getChatOtherPerson(selectedChat.chatParticipants).id,
        caption,
        fileName,
        fileUrl,
        fileType
      ).done(() => {
        handleClose();
        // setNewText("");
        // inputRef.current.clear();
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

  function handleMessageFileDownload(messageObject) {
    if (messageObject.data != undefined) {
      let httpsReference = storage.refFromURL(messageObject.data.uri);
      httpsReference
        .getDownloadURL()
        .then((url) => {
          // This can be downloaded directly:
          var xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = (event) => {
            var blob = xhr.response;
          };
          xhr.open("GET", url);
          xhr.send();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function renderChat() {
    return (
      <div id="Chat" style={{ overflowY: "auto", marginTop: "5px" }}>
        <MessageList
          className="message-list"
          lockable={true}
          dataSource={messages}
          onClick={(messageObject) => handleMessageFileDownload(messageObject)}
        />
      </div>
    );
  }

  function handleEnterKeyPress(event) {
    if (event.key === "Enter") {
      handleSend();
    }
  }

  function renderChatInput() {
    return (
      <div>
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
                <label for="pic" className="btn">
                  <img
                    style={{ height: "23px" }}
                    src={chatPaperClip}
                    alt="chatPaperClip"
                  />
                  <input
                    id="pic"
                    type="file"
                    name="file"
                    style={{ display: "none" }}
                    onChange={changeFileHandler}
                  />
                </label>
              </Button>
            </div>
          }
        />
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogContent dividers>
            {fileUrl &&
              fileName &&
              fileType &&
              (fileType.split("/")[0] == "image" ? (
                progress == 100 ? (
                  <img className="img-fluid mx-auto d-block" src={fileUrl} />
                ) : (
                  <progress value={progress} max="100" />
                )
              ) : (
                <FileTypes data={fileName.split(".")[1]}></FileTypes>
              ))}

            <TextField
              autoFocus
              margin="dense"
              id="body"
              label="Caption"
              type="text"
              fullWidth
              onChange={(e) => setCaption(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleFileSend} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return (
    <div onKeyPress={handleEnterKeyPress}>
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
