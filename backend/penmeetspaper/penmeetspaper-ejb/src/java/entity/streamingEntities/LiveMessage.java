/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity.streamingEntities;

import entity.personEntities.Person;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author carlc
 */
@Entity
public class LiveMessage implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String body;

  @Column(nullable = false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date date;

  // unidirectional 
  @ManyToOne
  private Person sender;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getBody() {
    return body;
  }

  public void setBody(String body) {
    this.body = body;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public Person getSender() {
    return sender;
  }

  public void setSender(Person sender) {
    this.sender = sender;
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
    if (!(object instanceof LiveMessage)) {
      return false;
    }
    LiveMessage other = (LiveMessage) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.LiveMessage[ id=" + id + " ]";
  }

}
