/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity.adminEntities;

import enumeration.AdminDutyEnum;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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
public class AdminDuties implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  private AdminDutyEnum dutyType;

  @Column(nullable = false)
  private String messageBody;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private boolean isResolved;

  @Column(nullable = false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date dateSubmitted;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public AdminDutyEnum getDutyType() {
    return dutyType;
  }

  public void setDutyType(AdminDutyEnum dutyType) {
    this.dutyType = dutyType;
  }

  public String getMessageBody() {
    return messageBody;
  }

  public void setMessageBody(String messageBody) {
    this.messageBody = messageBody;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public boolean isIsResolved() {
    return isResolved;
  }

  public void setIsResolved(boolean isResolved) {
    this.isResolved = isResolved;
  }

  public Date getDateSubmitted() {
    return dateSubmitted;
  }

  public void setDateSubmitted(Date dateSubmitted) {
    this.dateSubmitted = dateSubmitted;
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
    if (!(object instanceof AdminDuties)) {
      return false;
    }
    AdminDuties other = (AdminDuties) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.adminEntities.AdminDuties[ id=" + id + " ]";
  }

}
