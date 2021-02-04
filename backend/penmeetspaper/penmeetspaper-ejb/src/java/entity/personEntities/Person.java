/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity.personEntities;

import entity.Community;
import entity.File;
import entity.Folder;
import entity.PersonEngagement;
import entity.Post;
import entity.Review;
import entity.streamingEntities.Stream;
import entity.Subscription;
import entity.messagingEntities.Chat;
import entity.messagingEntities.Message;
import entity.viewEntities.ProfilePageView;
import entity.walletEntities.Wallet;
import enumeration.TopicEnum;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

/**
 *
 * @author carlc
 */
@Entity
public class Person implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    // unidirectional
    @OneToMany
    @JoinColumn(name = "person_id")
    private List<Stream> pastStreams = new ArrayList<>();

    // birectional
    @OneToOne
    @JoinColumn(name = "streamStreaming")
    private Stream streamStreaming;

    // birectional
    @ManyToOne
    @JoinColumn(name = "streamViewing")
    private Stream streamViewing;

    // birectional
    @OneToMany(mappedBy = "owner")
    private List<Folder> folders = new ArrayList<>();

    // birectional
    @ManyToMany
    @JoinTable(name = "person_likedFiles",
            joinColumns = {
                @JoinColumn(name = "person_id")},
            inverseJoinColumns = {
                @JoinColumn(name = "likedFiles_id")})
    private List<File> likedFiles = new ArrayList<>();

    // birectional
    @ManyToMany
    @JoinTable(name = "followers_following",
            joinColumns = {
                @JoinColumn(name = "following_id")},
            inverseJoinColumns = {
                @JoinColumn(name = "followers_id")})
    private List<Person> followers = new ArrayList<>();

    // birectional
    @ManyToMany(mappedBy = "followers")
    private List<Person> following = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private TopicEnum interestedTopics;

    @Enumerated(EnumType.STRING)
    private TopicEnum teachingTopics;

    @OneToMany(mappedBy = "reviewer")
    private List<Review> reviews = new ArrayList<>();

    // Unidirectional
    @OneToMany
    @JoinColumn(name = "profilePageView_id")
    private List<ProfilePageView> profilePageView = new ArrayList<>();

    // Unidirectional
    @OneToOne
    private Wallet wallet;

    @OneToMany(mappedBy = "subscriber")
    private List<Subscription> subscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "publisher")
    private List<Subscription> publications = new ArrayList<>();

    @ManyToMany(mappedBy = "chatParticipants")
    private List<Chat> chat = new ArrayList<>();

    @OneToMany(mappedBy = "sender")
    private List<Message> messagesSent = new ArrayList<>();

    @OneToMany(mappedBy = "recipient")
    private List<Message> messagesRecieved = new ArrayList<>();

    @OneToMany(mappedBy = "owner")
    private List<Community> ownedCommunities = new ArrayList<>();

    @OneToMany(mappedBy = "person")
    private List<PersonEngagement> communityEngagements = new ArrayList<>();

    @ManyToMany(mappedBy = "likes")
    private List<Post> likedPost = new ArrayList<>();

    @OneToMany(mappedBy = "author")
    private List<Post> posts = new ArrayList<>();

    // END TO VARIABLES
    public Person() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Person> getFollowers() {
        return followers;
    }

    public void setFollowers(List<Person> followers) {
        this.followers = followers;
    }

    public List<Person> getFollowing() {
        return following;
    }

    public void setFollowing(List<Person> following) {
        this.following = following;
    }

    public List<Stream> getPastStreams() {
        return pastStreams;
    }

    public void setPastStreams(List<Stream> pastStreams) {
        this.pastStreams = pastStreams;
    }

    public Stream getStreamStreaming() {
        return streamStreaming;
    }

    public void setStreamStreaming(Stream streamStreaming) {
        this.streamStreaming = streamStreaming;
    }

    public Stream getStreamViewing() {
        return streamViewing;
    }

    public void setStreamViewing(Stream streamViewing) {
        this.streamViewing = streamViewing;
    }

    public List<Folder> getFolders() {
        return folders;
    }

    public void setFolders(List<Folder> folders) {
        this.folders = folders;
    }

    public List<File> getLikedFiles() {
        return likedFiles;
    }

    public void setLikedFiles(List<File> likedFiles) {
        this.likedFiles = likedFiles;
    }

    public TopicEnum getInterestedTopics() {
        return interestedTopics;
    }

    public void setInterestedTopics(TopicEnum interestedTopics) {
        this.interestedTopics = interestedTopics;
    }

    public TopicEnum getTeachingTopics() {
        return teachingTopics;
    }

    public void setTeachingTopics(TopicEnum teachingTopics) {
        this.teachingTopics = teachingTopics;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public List<ProfilePageView> getProfilePageView() {
        return profilePageView;
    }

    public void setProfilePageView(List<ProfilePageView> profilePageView) {
        this.profilePageView = profilePageView;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }

    public List<Subscription> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(List<Subscription> subscriptions) {
        this.subscriptions = subscriptions;
    }

    public List<Subscription> getPublications() {
        return publications;
    }

    public void setPublications(List<Subscription> publications) {
        this.publications = publications;
    }

    public List<Chat> getChat() {
        return chat;
    }

    public void setChat(List<Chat> chat) {
        this.chat = chat;
    }

    public List<Message> getMessagesSent() {
        return messagesSent;
    }

    public void setMessagesSent(List<Message> messagesSent) {
        this.messagesSent = messagesSent;
    }

    public List<Message> getMessagesRecieved() {
        return messagesRecieved;
    }

    public void setMessagesRecieved(List<Message> messagesRecieved) {
        this.messagesRecieved = messagesRecieved;
    }

    public List<Community> getOwnedCommunities() {
        return ownedCommunities;
    }

    public void setOwnedCommunities(List<Community> ownedCommunities) {
        this.ownedCommunities = ownedCommunities;
    }

    public List<PersonEngagement> getCommunityEngagements() {
        return communityEngagements;
    }

    public void setCommunityEngagements(List<PersonEngagement> communityEngagements) {
        this.communityEngagements = communityEngagements;
    }

    public List<Post> getLikedPost() {
        return likedPost;
    }

    public void setLikedPost(List<Post> likedPost) {
        this.likedPost = likedPost;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Person)) {
            return false;
        }
        Person other = (Person) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Person[ id=" + id + " ]";
    }

}
