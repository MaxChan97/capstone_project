const jQuery = require("jquery");

const SERVER_PREFIX = "http://localhost:8080/penmeetspaper-war/webresources";

export default {
  SERVER_PREFIX: SERVER_PREFIX,

  createPerson(email, username, password) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
    });
  },

  login(email, password) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/account/login/query?" +
        "email=" +
        email +
        "&password=" +
        password,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getPersonById(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  createPostForPerson(id, postBody) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/person/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        postBody: postBody,
      }),
    });
  },

  getPersonsPost(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/person/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  editPersonProfileInformation(id, username, description, topicInterests) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + id + "?type=information",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        username: username,
        description: description,
        topicInterests: topicInterests,
      }),
    });
  },

  createChat(senderId, recipientId, messageBody) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/chat/" + senderId + "/" + recipientId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        body: messageBody,
      }),
    });
  },

  getPersonsChat(personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/chat/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  addMessageToChat(chatId, senderId, recipientId, messageBody) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/message/" +
        chatId +
        "/" +
        senderId +
        "/" +
        recipientId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        body: messageBody,
      }),
    });
  },
};
