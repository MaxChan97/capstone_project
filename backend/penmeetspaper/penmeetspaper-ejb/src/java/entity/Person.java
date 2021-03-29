/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import enumeration.IncomeRangeEnum;
import enumeration.TopicEnum;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

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

  // primitive varibles
  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = false)
  private String password;

  @Column(nullable = false, unique = true)
  private String email;

  @Temporal(TemporalType.DATE)
  private Date createdDate;

  @Temporal(TemporalType.DATE)
  private Date dob;

  @Column(length = 2048)
  private String description;

  @Column
  private String profilePicture;

  @Column
  private String profileBanner;

  @Column
  private String resetId;

  @Column(nullable = false)
  private boolean hasExplicitLanguage;

  @Column(nullable = false)
  private double contentCreatorPoints;

  @Column(nullable = false)
  private double contributorPoints;

  @Column(nullable = false)
  private double pricingPlan;

  @Column(nullable = false)
  private boolean isBannedFromLogin;

  @Column(nullable = false)
  private boolean chatIsPaid;

  // Entity Variables ------------------
  //
  @Enumerated(EnumType.STRING)
  private IncomeRangeEnum incomeRange;

  @Enumerated(EnumType.STRING)
  private List<TopicEnum> topicInterests = new ArrayList<>();

  @OneToMany(mappedBy = "publisher")
  private List<Follow> followers = new ArrayList<>();

  @OneToMany(mappedBy = "follower")
  private List<Follow> following = new ArrayList<>();

  // birectional
  @OneToMany(mappedBy="streamer")
  private List<Stream> streams = new ArrayList<>();

  @OneToMany(mappedBy = "subscriber")
  private List<Subscription> subscriptions = new ArrayList<>();

  @OneToMany(mappedBy = "publisher")
  private List<Subscription> publications = new ArrayList<>();

  @ManyToMany(mappedBy = "chatParticipants")
  private List<Chat> chats = new ArrayList<>();

  @OneToMany(mappedBy = "owner")
  private List<Community> ownedCommunities = new ArrayList<>();

  @ManyToMany(mappedBy = "members")
  private List<Community> followingCommunities = new ArrayList<>();

  @OneToMany(mappedBy = "author")
  private List<Post> posts = new ArrayList<>();

  // unidirectional
  @OneToMany
  @JoinColumn(name = "notification_id")
  private List<Notification> notifications = new ArrayList();

  // unidirectional
  @OneToOne
  private Ban ban;

  @ManyToMany(mappedBy = "likes")
  private List<Video> likedVideos = new ArrayList<>();

  @OneToMany(mappedBy = "creator")
  private List<Video> videosCreated = new ArrayList<>();

  @OneToMany(mappedBy = "reporter")
  private List<Report> reports = new ArrayList<>();

  // unidirectional
  @OneToMany
  @JoinColumn(name = "paymentTransaction_id")
  private List<PaymentTransaction> paymentTransactions = new ArrayList<>();

  // unidirectional
  @OneToMany
  @JoinColumn(name = "paymentCard_id")
  private List<PaymentCard> paymentCards = new ArrayList<>();

  // unidirectional
  @OneToMany
  @JoinColumn(name = "bankAccount_id")
  private List<BankAccount> bankAccounts = new ArrayList<>();

  // unidirectional
  @OneToMany
  @JoinColumn(name = "badge_id")
  private List<Badge> badges = new ArrayList<>();

  // unidirectional | nullable
  @OneToOne
  private Badge badgeDisplaying;

  @OneToOne(cascade = CascadeType.PERSIST)
  private FollowersAnalytics followersAnalytics = new FollowersAnalytics();

  @OneToOne(cascade = CascadeType.PERSIST)
  private SubscribersAnalytics subscribersAnalytics = new SubscribersAnalytics();

  @OneToOne(cascade = CascadeType.PERSIST)
  private EarningsAnalytics earningsAnalytics = new EarningsAnalytics();

  @OneToOne(cascade = CascadeType.PERSIST)
  private ViewersAnalytics viewersAnalytics = new ViewersAnalytics();

  // Getters and Setters -----------------------------------------------------------
  public Person() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
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

  public Date getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(Date createdDate) {
    this.createdDate = createdDate;
  }

  public Date getDob() {
    return dob;
  }

  public void setDob(Date dob) {
    this.dob = dob;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getProfilePicture() {
    return profilePicture;
  }

  public void setProfilePicture(String profilePicture) {
    this.profilePicture = profilePicture;
  }

  public boolean isHasExplicitLanguage() {
    return hasExplicitLanguage;
  }

  public void setHasExplicitLanguage(boolean hasExplicitLanguage) {
    this.hasExplicitLanguage = hasExplicitLanguage;
  }

  public double getContentCreatorPoints() {
    return contentCreatorPoints;
  }

  public void setContentCreatorPoints(double contentCreatorPoints) {
    this.contentCreatorPoints = contentCreatorPoints;
  }

  public double getContributorPoints() {
    return contributorPoints;
  }

  public void setContributorPoints(double contributorPoints) {
    this.contributorPoints = contributorPoints;
  }

  public double getPricingPlan() {
    return pricingPlan;
  }

  public void setPricingPlan(double pricingPlan) {
    this.pricingPlan = pricingPlan;
  }

  public boolean isIsBannedFromLogin() {
    return isBannedFromLogin;
  }

  public void setIsBannedFromLogin(boolean isBannedFromLogin) {
    this.isBannedFromLogin = isBannedFromLogin;
  }

  public boolean isChatIsPaid() {
    return chatIsPaid;
  }

  public void setChatIsPaid(boolean chatIsPaid) {
    this.chatIsPaid = chatIsPaid;
  }

  public IncomeRangeEnum getIncomeRange() {
    return incomeRange;
  }

  public void setIncomeRange(IncomeRangeEnum incomeRange) {
    this.incomeRange = incomeRange;
  }

  public List<TopicEnum> getTopicInterests() {
    return topicInterests;
  }

  public void setTopicInterests(List<TopicEnum> topicInterests) {
    this.topicInterests = topicInterests;
  }

  public List<Follow> getFollowers() {
    return followers;
  }

  public void setFollowers(List<Follow> followers) {
    this.followers = followers;
  }

  public List<Follow> getFollowing() {
    return following;
  }

  public void setFollowing(List<Follow> following) {
    this.following = following;
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

  public List<Chat> getChats() {
    return chats;
  }

  public void setChats(List<Chat> chats) {
    this.chats = chats;
  }

  public List<Community> getOwnedCommunities() {
    return ownedCommunities;
  }

  public void setOwnedCommunities(List<Community> ownedCommunities) {
    this.ownedCommunities = ownedCommunities;
  }

  public List<Community> getFollowingCommunities() {
    return followingCommunities;
  }

  public void setFollowingCommunities(List<Community> followingCommunities) {
    this.followingCommunities = followingCommunities;
  }

  public List<Post> getPosts() {
    return posts;
  }

  public void setPosts(List<Post> posts) {
    this.posts = posts;
  }

  public List<Notification> getNotifications() {
    return notifications;
  }

  public void setNotifications(List<Notification> notifications) {
    this.notifications = notifications;
  }

  public Ban getBan() {
    return ban;
  }

  public void setBan(Ban ban) {
    this.ban = ban;
  }

  public List<Video> getLikedVideos() {
    return likedVideos;
  }

  public void setLikedVideos(List<Video> likedVideos) {
    this.likedVideos = likedVideos;
  }

  public List<Video> getVideosCreated() {
    return videosCreated;
  }

  public void setVideosCreated(List<Video> videosCreated) {
    this.videosCreated = videosCreated;
  }

  public List<Report> getReports() {
    return reports;
  }

  public void setReports(List<Report> reports) {
    this.reports = reports;
  }

  public List<PaymentTransaction> getPaymentTransactions() {
    return paymentTransactions;
  }

  public void setPaymentTransactions(List<PaymentTransaction> paymentTransactions) {
    this.paymentTransactions = paymentTransactions;
  }

  public List<PaymentCard> getPaymentCards() {
    return paymentCards;
  }

  public void setPaymentCards(List<PaymentCard> paymentCards) {
    this.paymentCards = paymentCards;
  }

  public List<BankAccount> getBankAccounts() {
    return bankAccounts;
  }

  public void setBankAccounts(List<BankAccount> bankAccounts) {
    this.bankAccounts = bankAccounts;
  }

  public List<Badge> getBadges() {
    return badges;
  }

  public void setBadges(List<Badge> badges) {
    this.badges = badges;
  }

  public Badge getBadgeDisplaying() {
    return badgeDisplaying;
  }

  public void setBadgeDisplaying(Badge badgeDisplaying) {
    this.badgeDisplaying = badgeDisplaying;
  }

  public String getResetId() {
    return resetId;
  }

  public void setResetId(String resetId) {
    this.resetId = resetId;
  }

  public FollowersAnalytics getFollowersAnalytics() {
    return followersAnalytics;
  }

  public void setFollowersAnalytics(FollowersAnalytics followersAnalytics) {
    this.followersAnalytics = followersAnalytics;
  }

  public SubscribersAnalytics getSubscribersAnalytics() {
    return subscribersAnalytics;
  }

  public void setSubscribersAnalytics(SubscribersAnalytics subscribersAnalytics) {
    this.subscribersAnalytics = subscribersAnalytics;
  }

  public EarningsAnalytics getEarningsAnalytics() {
    return earningsAnalytics;
  }

  public void setEarningsAnalytics(EarningsAnalytics earningsAnalytics) {
    this.earningsAnalytics = earningsAnalytics;
  }

  public ViewersAnalytics getViewersAnalytics() {
    return viewersAnalytics;
  }

  public void setViewersAnalytics(ViewersAnalytics viewersAnalytics) {
    this.viewersAnalytics = viewersAnalytics;
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

  /**
   * @return the profileBanner
   */
  public String getProfileBanner() {
    return profileBanner;
  }

  /**
   * @param profileBanner the profileBanner to set
   */
  public void setProfileBanner(String profileBanner) {
    this.profileBanner = profileBanner;
  }

    /**
     * @return the streams
     */
    public List<Stream> getStreams() {
        return streams;
    }

    /**
     * @param streams the streams to set
     */
    public void setStreams(List<Stream> streams) {
        this.streams = streams;
    }

}
