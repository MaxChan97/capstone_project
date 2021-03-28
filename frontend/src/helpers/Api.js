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

  getPersonByEmail(email) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/email/" + email,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  saveResetId(email, resetId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/saveResetId/" + email,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        resetId: resetId,
      }),
    });
  },

  resetPassword(resetId, newPassword) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/resetPassword/" + resetId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        newPassword: newPassword,
      }),
    });
  },

  changePassword(id, oldPassword, newPassword) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/changePassword/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });
  },

  createPostForPerson(
    id,
    postBody,
    fileName,
    fileUrl,
    fileType,
    postPollQuestion,
    postPollOptions
  ) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/person/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        postBody: postBody,
        fileName: fileName,
        fileUrl: fileUrl,
        fileType: fileType,
        postPollQuestion: postPollQuestion,
        postPollOptions: postPollOptions,
      }),
    });
  },

  //get a list of posts
  getPersonsPost(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + id + "/posts",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getPost(postId, isCommunityPost) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/" + postId + "/" + isCommunityPost,
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

  getCommunityById(communityId, personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/community/" + communityId + "/" + personId,
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
    communityBanner
  ) {
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
  },

  followPerson(followerId, publisherId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/follow/follower/" +
        followerId +
        "/publisher/" +
        publisherId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
    });
  },

  unfollowPerson(followerId, publisherId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/follow/follower/" +
        followerId +
        "/publisher/" +
        publisherId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "DELETE",
    });
  },

  subscribeToPerson(subscriberId, publisherId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/subscription/subscriber/" +
        subscriberId +
        "/publisher/" +
        publisherId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
    });
  },

  unsubscribeFromPerson(subscriberId, publisherId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/subscription/subscriber/" +
        subscriberId +
        "/publisher/" +
        publisherId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "DELETE",
    });
  },

  updateExplicitAndChat(personId, explicit, chatIsPaid) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + personId + "/settings",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        explicit: explicit,
        subscriberOnly: chatIsPaid,
      }),
    });
  },

  updatePricingPlan(personId, pricing) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + personId + "/pricingPlan",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        pricingPlan: pricing,
      }),
    });
  },

  voteOnPoll(personId, pollId, optionVoted) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/poll/" + pollId + "/person/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        optionVoted: optionVoted,
      }),
    });
  },

  editCommunityDetails(
    communityId,
    communityDescription,
    topicEnums,
    communityProfilePicture,
    communityBanner
  ) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX + "/community/" + communityId + "?type=information",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        communityDescription: communityDescription,
        topicEnums: topicEnums,
        communityProfilePicture: communityProfilePicture,
        communityBanner: communityBanner,
      }),
    });
  },

  createCommunityPost(
    communityId,
    personId,
    postBody,
    fileName,
    fileUrl,
    fileType,
    postPollQuestion,
    postPollOptions
  ) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/post/community/" +
        communityId +
        "/person/" +
        personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        postBody: postBody,
        fileName: fileName,
        fileUrl: fileUrl,
        fileType: fileType,
        postPollQuestion: postPollQuestion,
        postPollOptions: postPollOptions,
      }),
    });
  },

  followCommunity(communityId, personId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/community/" +
        communityId +
        "/person/" +
        personId +
        "/follow",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  unfollowCommunity(communityId, personId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/community/" +
        communityId +
        "/person/" +
        personId +
        "/unfollow",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  getCommunityMembers(CommunityId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/community/" + CommunityId + "/members",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getOwnedCommunities(personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + personId + "/ownedCommunities",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getFollowingCommunities(personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + personId + "/followingCommunities",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getFollowingAndOwnedCommunities(personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + personId + "/followingandowned",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  deleteCommunity(communityId, ownerId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX + "/community/" + communityId + "/person/" + ownerId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "DELETE",
    });
  },

  searchPersonByUsername(searchString) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/query?username=" + searchString,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  deleteCommunityPost(personId, postId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/community/" + personId + "/" + postId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "DELETE",
    });
  },

  searchCommunityByName(searchString) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/community/query?name=" + searchString,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  banPersonFromCommunity(communityId, personId, ownerId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/community/" +
        communityId +
        "/ban/" +
        "person/" +
        personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        ownerId: ownerId,
      }),
    });
  },

  //get posts of people that current user is following
  getFollowingPosts(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + id + "/followingPosts",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  //get posts of people that current user is following
  getFollowingCommunityPosts(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + id + "/followingCommunityPosts",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  isSubscribed(subscriberId, publisherId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/person/" +
        subscriberId +
        "/isSubscribedTo/" +
        publisherId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getFollowersAnalytics(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/analytics/followersAnalytics/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getSubscribersAnalytics(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/analytics/subscribersAnalytics/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getEarningsAnalytics(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/analytics/earningsAnalytics/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getViewersAnalytics(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/analytics/viewersAnalytics/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  adminLogin(email, password) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/account/adminlogin/query?" +
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
};
