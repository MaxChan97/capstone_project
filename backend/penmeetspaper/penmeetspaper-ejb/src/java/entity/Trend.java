/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

/**
 *
 * @author Shawn
 */
@Entity
public class Trend implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String hashTag;

  private HashMap<Date, Long> dateCount = new HashMap<Date, Long>();

  //bidirectional
  @ManyToMany
  private List<Post> posts = new ArrayList<>();

  //bidirectional
  @ManyToMany
  private List<Stream> streams = new ArrayList<>();

  public Trend() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getHashTag() {
    return hashTag;
  }

  public void setHashTag(String hashTag) {
    this.hashTag = hashTag;
  }

  public HashMap<Date, Long> getDateCount() {
    return dateCount;
  }

  public void setDateCount(HashMap<Date, Long> dateCount) {
    this.dateCount = dateCount;
  }

  public List<Post> getPosts() {
    return posts;
  }

  public void setPosts(List<Post> posts) {
    this.posts = posts;
  }

  public List<Stream> getStreams() {
    return streams;
  }

  public void setStreams(List<Stream> streams) {
    this.streams = streams;
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
    if (!(object instanceof Trend)) {
      return false;
    }
    Trend other = (Trend) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.Trend[ id=" + id + " ]";
  }

}
