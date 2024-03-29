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
public class Message implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // unidirectional
  @ManyToOne
  @JoinColumn(name = "messagesSent_person")
  private Person sender;

  // unidirectional
  @ManyToOne
  @JoinColumn(name = "messagesRecieved_person")
  private Person recipient;

  private String body;

  private String fileName;

  private String fileUrl;

  private String fileType;

  private boolean opened = false;

  @Column(nullable = false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date dateTime;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Person getSender() {
    return sender;
  }

  public void setSender(Person sender) {
    this.sender = sender;
  }

  public Person getRecipient() {
    return recipient;
  }

  public void setRecipient(Person recipient) {
    this.recipient = recipient;
  }

  public String getBody() {
    return body;
  }

  public void setBody(String body) {
    this.body = body;
  }

  public Date getDateTime() {
    return dateTime;
  }

  public void setDateTime(Date dateTime) {
    this.dateTime = dateTime;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public String getFileUrl() {
    return fileUrl;
  }

  public void setFileUrl(String fileUrl) {
    this.fileUrl = fileUrl;
  }

  public String getFileType() {
    return fileType;
  }

  public void setFileType(String fileType) {
    this.fileType = fileType;
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
    if (!(object instanceof Message)) {
      return false;
    }
    Message other = (Message) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.Message[ id=" + id + " ]";
  }

  /**
   * @return the opened
   */
  public boolean isOpened() {
    return opened;
  }

  /**
   * @param opened the opened to set
   */
  public void setOpened(boolean opened) {
    this.opened = opened;
  }

}
