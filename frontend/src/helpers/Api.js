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
    DoB,
    incomeRange,
    description,
    topicInterests,
    profilePicture,
    profileBanner
  ) {
    //const incomeRangeStr = incomeRange.value;
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        username: username,
        DoB: DoB,
        incomeRange: incomeRange,
        description: description,
        topicInterests: topicInterests,
        profilePicture: profilePicture,
        profileBanner: profileBanner,
      }),
    });
  },

  editPersonProfilePicture(id, profilePicture) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/profilePicture/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        profilePicture: profilePicture,
      }),
    });
  },

  editPersonProfileBanner(id, profileBanner) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/profileBanner/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        profileBanner: profileBanner,
      }),
    });
  },

  editPersonDescription(id, description) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/description/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        description: description,
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

  updatePersonProfile(personId, DoB, incomeRange) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + personId + "/onboarding",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        DoB: DoB,
        incomeRange: incomeRange,
      }),
    });
  },

  updateCompletedOnboarding(personId, topicInterests, DoB, incomeRange) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + personId + "/onboarding",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        DoB: DoB,
        incomeRange: incomeRange,
        topicInterests: topicInterests,
      }),
    });
  },

  updateSkipOnboarding(personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/" + personId + "/skipOnboarding",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        id: personId,
      }),
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

  editCommunityProfilePicture(communityId, communityProfilePicture) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/community/profilePicture/" + communityId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        communityProfilePicture: communityProfilePicture,
      }),
    });
  },

  editCommunityBanner(communityId, communityBanner) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/community/banner/" + communityId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        communityBanner: communityBanner,
      }),
    });
  },

  editCommunityDescription(communityId, communityDescription) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/community/description/" + communityId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        communityDescription: communityDescription,
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

  searchPostByBody(searchString) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/post/query?searchTerm=" + searchString,
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

  startStream(
    streamerId,
    streamTitle,
    streamDescription,
    subscribersOnly,
    accessUrl,
    thumbnailUrl,
    relatedTopics
  ) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/" + streamerId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        streamTitle: streamTitle,
        streamDescription: streamDescription,
        subscribersOnly: subscribersOnly,
        accessUrl: accessUrl,
        thumbnailUrl: thumbnailUrl,
        relatedTopics: relatedTopics,
      }),
    });
  },

  editStreamInfo(streamId, streamTitle, streamDescription, relatedTopics) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/streamInfo/" + streamId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        streamTitle: streamTitle,
        streamDescription: streamDescription,
        relatedTopics: relatedTopics,
      }),
    });
  },

  endStream(streamId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/" + streamId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  getStreamById(streamId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/" + streamId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getLiveChatByStreamId(streamId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/liveChat/" + streamId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  startLivePoll(streamId, livePollQuestion, livePollOptions) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/livePoll/" + streamId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        livePollQuestion: livePollQuestion,
        livePollOptions: livePollOptions,
      }),
    });
  },

  endLivePoll(livePollId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/livePoll/" + livePollId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "DELETE",
    });
  },

  voteOnLivePoll(livePollId, personId, optionVoted) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/stream/livePoll/" +
        livePollId +
        "/person/" +
        personId,
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

  getActiveLivePollByStreamId(streamId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/livePoll/" + streamId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  sendLiveChatMessage(streamId, senderId, messageBody) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/liveChat/" + streamId + "/" + senderId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        messageBody: messageBody,
      }),
    });
  },

  getOngoingStreams() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/ongoing",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getPersonOngoingStreams(personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/ongoing/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  handleEnterStream(streamId, personId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX + "/stream/views/enter/" + streamId + "/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  handleExitStream(streamId, personId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX + "/stream/views/exit/" + streamId + "/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  kickUserFromStream(streamId, personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/stream/kickUser/" + streamId + "/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  unkickUserFromStream(streamId, personId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX + "/stream/unkickUser/" + streamId + "/" + personId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  authenticateForApiVideo() {
    return jQuery.ajax({
      url: "https://ws.api.video/auth/api-key",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        apiKey: "dtB2Sqlankxjt0h9gET3oIDB7IPzd5hPNVg7EpVlOoj",
      }),
    });
  },

  createStreamOnApiVideo(streamTitle, authorization) {
    return jQuery.ajax({
      url: "https://ws.api.video/live-streams",
      headers: {
        Accept: "application/vnd.api.video+json",
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      type: "POST",
      data: JSON.stringify({
        name: streamTitle,
        record: false,
        public: true,
      }),
    });
  },

  uploadThumbnailOnApiVideo(liveStreamId, authorization, imageName, imageBlob) {
    return jQuery.ajax({
      url: "https://ws.api.video/live-streams/" + liveStreamId + "/thumbnail",
      headers: {
        Accept: "application/vnd.api.video+json",
        "Content-Type": "multipart/form-data",
        Authorization: authorization,
      },
      type: "POST",
      data: JSON.stringify({
        file: [imageName, imageBlob],
      }),
    });
  },

  deleteStreamOnApiVideo(liveStreamId, authorization) {
    return jQuery.ajax({
      url: "https://ws.api.video/live-streams/" + liveStreamId,
      headers: {
        Authorization: authorization,
      },
      type: "DELETE",
    });
  },

  getTopTenContributors() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/topTenContributors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getTopTenStreamers() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person/topTenStreamers",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  changeBadge(personId, badgeId) {
    return jQuery.ajax({
      url:
        this.SERVER_PREFIX +
        "/person/changeBadge/person/" +
        personId +
        "/badge/" +
        badgeId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  createAdmin(username, email) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/admin/1",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        username: username,
        email: email,
      }),
    });
  },

  getAllPerson() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/person",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getTopTrends() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/trend/topAllTime",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getTodaysTrends() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/trend/topToday",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getAllAdmin() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/admin/all",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getAllAdminLogs() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/adminLog/all",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getAdminLogByAdminId(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/adminLog/admin/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getAdminById(id) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/admin/" + id,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  banPersonFromLogin(adminId, personId, description, reportId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/admin/" + adminId + "/banPerson",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        personId: personId,
        description: description,
        reportId: reportId,
      }),
    });
  },

  unbanPersonFromLogin(adminId, personId, description, reportId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/admin/" + adminId + "/unbanPerson",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      data: JSON.stringify({
        personId: personId,
        description: description,
        reportId: reportId,
      }),
    });
  },

  getTopCommunities() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/community/topCommunities",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  deactivateAdmin(adminId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/admin/1/deactivate/" + adminId,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
    });
  },

  createReport(
    messageBody,
    reporterId,
    reportTypeEnum,
    reportedContentId,
    category
  ) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/report",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        messageBody: messageBody,
        reporterId: reporterId,
        reportTypeEnum: reportTypeEnum,
        reportedContentId: reportedContentId,
        category: category,
      }),
    });
  },

  getAllReports() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/report/all",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getSiteWideOnboardingAnalytics() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/analytics/siteWideAnalytics/onboardingCount",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getSiteWideFollowersAnalytics() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/analytics/siteWideAnalytics/followersCount",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getSiteWideSubscribersAnalytics() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/analytics/siteWideAnalytics/subscribersCount",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getSiteWideEarningsAnalytics() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/analytics/siteWideAnalytics/earnings",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getSiteWidePostsAnalytics() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/analytics/siteWideAnalytics/postsCount",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },

  getSiteWideStreamsAnalytics() {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/analytics/siteWideAnalytics/streamsCount",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
    });
  },
};
