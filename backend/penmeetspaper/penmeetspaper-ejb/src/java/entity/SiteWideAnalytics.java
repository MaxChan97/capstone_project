/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 *
 * @author carlc
 */
@Entity
public class SiteWideAnalytics implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  private HashMap<Date, Long> onboardingCount = new HashMap<>();
  
  private HashMap<Date, Long> subscribersCount = new HashMap<>();
  
  private HashMap<Date, Long> followersCount = new HashMap<>();
  
  private HashMap<Date, Double> revenue = new HashMap<>();
  
  private HashMap<Date, Long> postsCount = new HashMap<>();
  
  private HashMap<Date, Long> streamsCount = new HashMap<>();

  public SiteWideAnalytics() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public HashMap<Date, Long> getOnboardingCount() {
    return onboardingCount;
  }

  public void setOnboardingCount(HashMap<Date, Long> onboardingCount) {
    this.onboardingCount = onboardingCount;
  }

  public HashMap<Date, Long> getSubscribersCount() {
    return subscribersCount;
  }

  public void setSubscribersCount(HashMap<Date, Long> subscribersCount) {
    this.subscribersCount = subscribersCount;
  }

  public HashMap<Date, Long> getFollowersCount() {
    return followersCount;
  }

  public void setFollowersCount(HashMap<Date, Long> followersCount) {
    this.followersCount = followersCount;
  }

  public HashMap<Date, Double> getRevenue() {
    return revenue;
  }

  public void setRevenue(HashMap<Date, Double> revenue) {
    this.revenue = revenue;
  }

  public HashMap<Date, Long> getPostsCount() {
    return postsCount;
  }

  public void setPostsCount(HashMap<Date, Long> postsCount) {
    this.postsCount = postsCount;
  }

  public HashMap<Date, Long> getStreamsCount() {
    return streamsCount;
  }

  public void setStreamsCount(HashMap<Date, Long> streamsCount) {
    this.streamsCount = streamsCount;
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
    if (!(object instanceof SiteWideAnalytics)) {
      return false;
    }
    SiteWideAnalytics other = (SiteWideAnalytics) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.SiteWideAnalytics[ id=" + id + " ]";
  }

}
