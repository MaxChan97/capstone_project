/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity.siteAnalyticsEntities;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author Shawn
 */
@Entity
public class SiteWideMonthlySubscriberCount implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private int siteWideSubscriberCount;

  @Temporal(TemporalType.DATE)
  private Date monthOf;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public int getSiteWideSubscriberCount() {
    return siteWideSubscriberCount;
  }

  public void setSiteWideSubscriberCount(int siteWideSubscriberCount) {
    this.siteWideSubscriberCount = siteWideSubscriberCount;
  }

  public Date getMonthOf() {
    return monthOf;
  }

  public void setMonthOf(Date monthOf) {
    this.monthOf = monthOf;
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
    if (!(object instanceof SiteWideMonthlySubscriberCount)) {
      return false;
    }
    SiteWideMonthlySubscriberCount other = (SiteWideMonthlySubscriberCount) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.siteAnalyticsEntities.SiteWideMonthlySubscriberCount[ id=" + id + " ]";
  }

}
