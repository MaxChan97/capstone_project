/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author Shawn
 */
@Entity
public class Subscription implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "subscription_subscriber")
  private Person subscriber;

  @ManyToOne
  @JoinColumn(name = "subscription_publisher")
  private Person publisher;

  @ManyToOne
  @JoinColumn(name = "pricingPlan_Subscription")
  private PricingPlan pricingPlan;

  @Column(nullable = false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date startDate;

  @Column(nullable = false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date endDate;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Person getSubscriber() {
    return subscriber;
  }

  public void setSubscriber(Person subscriber) {
    this.subscriber = subscriber;
  }

  public Person getPublisher() {
    return publisher;
  }

  public void setPublisher(Person publisher) {
    this.publisher = publisher;
  }

  public PricingPlan getPricingPlan() {
    return pricingPlan;
  }

  public void setPricingPlan(PricingPlan pricingPlan) {
    this.pricingPlan = pricingPlan;
  }

  public Date getStartDate() {
    return startDate;
  }

  public void setStartDate(Date startDate) {
    this.startDate = startDate;
  }

  public Date getEndDate() {
    return endDate;
  }

  public void setEndDate(Date endDate) {
    this.endDate = endDate;
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
    if (!(object instanceof Subscription)) {
      return false;
    }
    Subscription other = (Subscription) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.Subscription[ id=" + id + " ]";
  }

}
