/* eslint-disable import/no-anonymous-default-export */
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

  //get a list of posts
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

  getPost(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  editPersonProfileInformation(
    id,
    username,
    description,
    topicInterests,
    profilePicture,
    profileBanner
  ) {
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
        profilePicture: profilePicture,
        profileBanner: profileBanner,
      }),
    });
  },

  editProfilePost(personId, postId, postBody) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/person/" + personId + "/edit/" + postId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        postBody: postBody,
      }),
    });
  },

  deleteProfilePost(personId, postId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/person/" + personId + "/" + postId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "DELETE",
    });
  },

  createCommentForProfilePosts(postId, personId, commentBody) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/" + postId + "/person/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        commentBody: commentBody,
      }),
    });
  },

  likeProfilePost(postId, personId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/post/" +
        postId +
        "/person/" +
        personId +
        "/like",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  unlikeProfilePost(postId, personId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/post/" +
        postId +
        "/person/" +
        personId +
        "/unlike",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  likeProfilePostComment(commentId, personId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/comment/" +
        commentId +
        "/person/" +
        personId +
        "/like",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  saveFileUrl(url) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/file",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        url: url,
      }),
    });
  },

  createReplyForProfileComment(commentId, personId, replyBody) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/comment/" + commentId + "/person/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        replyBody: replyBody,
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

  createFileChat(
    senderId,
    recipientId,
    messageBody,
    fileName,
    fileUrl,
    fileType
  ) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/chat/file/" + senderId + "/" + recipientId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        body: messageBody,
        fileName: fileName,
        fileUrl: fileUrl,
        fileType: fileType,
      }),
    });
  },

  unlikeProfilePostComment(commentId, personId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/comment/" +
        commentId +
        "/person/" +
        personId +
        "/unlike",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  likeProfilePostReply(replyId, personId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/reply/" +
        replyId +
        "/person/" +
        personId +
        "/like",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  unlikeProfilePostReply(replyId, personId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/reply/" +
        replyId +
        "/person/" +
        personId +
        "/unlike",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  editProfilePostReply(replyId, personId, replyBody) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/reply/" + replyId + "/person/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        replyBody: replyBody,
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

  setAllMessagesAsOpened(chatId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/chat/" + chatId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  deleteProfilePostReply(replyId, personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/reply/" + replyId + "/person/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "DELETE",
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

  addFileToChat(
    chatId,
    senderId,
    recipientId,
    messageBody,
    fileName,
    fileUrl,
    fileType
  ) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/message/file/" +
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
        fileName: fileName,
        fileUrl: fileUrl,
        fileType: fileType,
      }),
    });
  },

  editProfilePostComment(commentId, personId, commentBody) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/comment/" + commentId + "/person/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        commentBody: commentBody,
      }),
    });
  },

  deleteProfilePostComment(commentId, personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/comment/" + commentId + "/person/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "DELETE",
    });
  },

  getFollowers(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + id + "/followers/",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getFollowing(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + id + "/following/",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getSubscriptions(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + id + "/subscriptions/",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getSubscribers(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + id + "/subscribers/",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getCommunityById(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/community/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  createCommunity(
    id,
    communityName, 
    communityDescription, 
    topicEnums,
    communityProfilePicture,
    communityBanner) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/community" + "/person/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        communityName: communityName,
        communityDescription: communityDescription,
        topicEnums: topicEnums,
        communityProfilePicture: communityProfilePicture,
        communityBanner: communityBanner,
      }),
    });
  }
};
