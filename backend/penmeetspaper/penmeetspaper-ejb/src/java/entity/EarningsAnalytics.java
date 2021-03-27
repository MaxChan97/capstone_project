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
public class EarningsAnalytics implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  
  private HashMap<Date, Double> earnings = new HashMap<Date, Double>();

  public EarningsAnalytics() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public HashMap<Date, Double> getEarnings() {
    return earnings;
  }

  public void setEarnings(HashMap<Date, Double> earnings) {
    this.earnings = earnings;
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
    if (!(object instanceof EarningsAnalytics)) {
      return false;
    }
    EarningsAnalytics other = (EarningsAnalytics) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.userAnalyticsEntities.EarningsAnalytics[ id=" + id + " ]";
  }
  
}
