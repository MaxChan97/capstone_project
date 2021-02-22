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
      url: this.SERVER_PREFIX + "/post/" + postId + "/person/" + personId + "/like",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  unlikeProfilePost(postId, personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/" + postId + "/person/" + personId + "/unlike",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  likeProfilePostComment(postId, personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/" + postId + "/person/" + personId + "/unlike",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

};
