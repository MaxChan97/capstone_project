/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity.streamingEntities;

import entity.personEntities.Person;
import entity.messagingEntities.LiveChat;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author carlc
 */
@Entity
public class Stream implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private boolean isPaid;

  @Column(nullable = false)
  private int viewerCount;

  @Temporal(TemporalType.TIMESTAMP)
  private Date date;

  // unidirectional
  @OneToOne
  private LiveChat liveChat;

  // birectional
  @OneToOne(mappedBy = "streamStreaming")
  private Person streamer;

  // bidirectional
  @OneToMany(mappedBy = "streamViewing")
  private List<Person> viewers = new ArrayList<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public boolean isIsPaid() {
    return isPaid;
  }

  public void setIsPaid(boolean isPaid) {
    this.isPaid = isPaid;
  }

  public int getViewerCount() {
    return viewerCount;
  }

  public void setViewerCount(int viewerCount) {
    this.viewerCount = viewerCount;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public LiveChat getLiveChat() {
    return liveChat;
  }

  public void setLiveChat(LiveChat liveChat) {
    this.liveChat = liveChat;
  }

  public Person getStreamer() {
    return streamer;
  }

  public void setStreamer(Person streamer) {
    this.streamer = streamer;
  }

  public List<Person> getViewers() {
    return viewers;
  }

  public void setViewers(List<Person> viewers) {
    this.viewers = viewers;
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
    if (!(object instanceof Stream)) {
      return false;
    }
    Stream other = (Stream) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.Stream[ id=" + id + " ]";
  }

}
