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
public class SubscribersAnalytics implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  
  private HashMap<Date, Long> subscribersCount = new HashMap<Date, Long>();

  public SubscribersAnalytics() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public HashMap<Date, Long> getSubscribersCount() {
    return subscribersCount;
  }

  public void setSubscribersCount(HashMap<Date, Long> subscribersCount) {
    this.subscribersCount = subscribersCount;
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
    if (!(object instanceof SubscribersAnalytics)) {
      return false;
    }
    SubscribersAnalytics other = (SubscribersAnalytics) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.userAnalyticsEntities.SubscribersAnalytics[ id=" + id + " ]";
  }
  
}
