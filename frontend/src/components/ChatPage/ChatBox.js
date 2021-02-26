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
import { storage } from "../../firebase";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
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
  };

  const changeFileHandler = (event) => {
    var oldName = event.target.files[0].name;
    setFileName(event.target.files[0].name);
    var suffix = oldName.split(".")[1];
    var randomId = uuid.v4();
    var newName = randomId.toString() + "." + suffix;
    const uploadTask = storage
      .ref(`images/${newName}`)
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
          .ref("images")
          .child(newName)
          .getDownloadURL()
          .then((url) => {
            setFileUrl(url);
          });
        handleClickOpen();
      }
    );
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
          date: dayjs(data.dateTime.slice(0, 24)).toDate(),
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
            data: { uri: data.fileUrl, status: { click: false, loading: 0 } },
          };
        } else if (MIMEPrefix === "video") {
          let message = {
            position: data.sender.id === currentUser ? "right" : "left",
            type: "video",
            text: data.body,
            date: dayjs(data.dateTime.slice(0, 24)).toDate(),
            data: { uri: data.fileUrl, status: { click: false, loading: 0 } },
          };
        } else if (MIMEPrefix === "audio") {
          let message = {
            position: data.sender.id === currentUser ? "right" : "left",
            type: "audio",
            text: data.body,
            date: dayjs(data.dateTime.slice(0, 24)).toDate(),
            data: { uri: data.fileUrl, status: { click: false, loading: 0 } },
          };
        } else {
          let message = {
            position: data.sender.id === currentUser ? "right" : "left",
            type: "file",
            text: data.body,
            date: dayjs(data.dateTime.slice(0, 24)).toDate(),
            data: { uri: data.fileUrl, status: { click: false, loading: 0 } },
          };
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

  function handleFileSend() {
    if (selectedChat.id === -1) {
      // means is a new chat
      Api.createFileChat(
        currentUser,
        getChatOtherPerson(selectedChat.chatParticipants).id,
        "hi",
        fileName,
        fileUrl
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
      console.log("ec");
      Api.addFileToChat(
        selectedChat.id,
        currentUser,
        getChatOtherPerson(selectedChat.chatParticipants).id,
        "hi",
        fileName,
        fileUrl
      ).done(() => {
        console.log("here");
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
            {progress == 100 ? (
              <img className="img-fluid" src={fileUrl} />
            ) : (
              <progress value={progress} max="100" />
            )}
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
