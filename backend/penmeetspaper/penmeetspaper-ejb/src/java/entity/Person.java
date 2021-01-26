/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import entity.viewEntities.ProfilePageView;
import entity.walletEntities.Wallet;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
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

  @OneToMany
  @JoinColumn(name = "person_id")
  private List<Stream> pastStreams = new ArrayList<>();

  @OneToOne
  @JoinColumn(name = "streamStreaming")
  private Stream streamStreaming;

  @ManyToOne
  @JoinColumn(name = "streamViewing")
  private Stream streamViewing;

  @OneToMany(mappedBy = "personReviews")
  private List<Review> reviews = new ArrayList<>();

  // Unidirectional
  @OneToMany
  @JoinColumn(name = "profilePageView_id")
  private List<ProfilePageView> profilePageView = new ArrayList<>();

  // Unidirectional
  @OneToOne
  private Wallet wallet;

  // Unidirectional
  @OneToMany
  @JoinColumn(name = "pricingPlans_id")
  private List<PricingPlan> pricingPlans = new ArrayList<>();

  @OneToMany(mappedBy = "subscription_subscriber")
  private List<Subscription> subscriptions = new ArrayList<>();

  @OneToMany(mappedBy = "subscription_publisher")
  private List<Subscription> publications = new ArrayList<>();

  @ManyToMany(mappedBy = "chatParticipants")
  private List<Chat> chat = new ArrayList<>();

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

  public List<PricingPlan> getPricingPlans() {
    return pricingPlans;
  }

  public void setPricingPlans(List<PricingPlan> pricingPlans) {
    this.pricingPlans = pricingPlans;
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
