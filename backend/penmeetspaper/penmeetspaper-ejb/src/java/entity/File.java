/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import enumeration.FileTypeEnum;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

/**
 *
 * @author carlc
 */
@Entity
public class File implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String logo;

  @Column(nullable = false)
  private boolean isVideo;

  @Column(nullable = false)
  private boolean isPaid;

  @Column(nullable = false)
  private Byte payload;

  // birectional
  @ManyToOne
  @JoinColumn(name = "folder_id")
  private Folder folder;

  // birectional
  @ManyToMany(mappedBy = "likedFiles")
  private List<Person> likes = new ArrayList<>();

//  // unidirectional
//  @OneToMany
//  @JoinColumn(name = "file_id")
//  private List<Comment> comments = new ArrayList<>();
  
//  private List<EducationLevelEnum> relatedEducationLevel = new ArrayList<>();
  
  private List<FileTypeEnum> fileType = new ArrayList<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLogo() {
    return logo;
  }

  public void setLogo(String logo) {
    this.logo = logo;
  }

  public boolean isIsVideo() {
    return isVideo;
  }

  public void setIsVideo(boolean isVideo) {
    this.isVideo = isVideo;
  }

  public boolean isIsPaid() {
    return isPaid;
  }

  public void setIsPaid(boolean isPaid) {
    this.isPaid = isPaid;
  }

  public Byte getPayload() {
    return payload;
  }

  public void setPayload(Byte payload) {
    this.payload = payload;
  }

  public Folder getFolder() {
    return folder;
  }

  public void setFolder(Folder folder) {
    this.folder = folder;
  }

  public List<Person> getLikes() {
    return likes;
  }

  public void setLikes(List<Person> likes) {
    this.likes = likes;
  }

  public List<FileTypeEnum> getFileType() {
    return fileType;
  }

  public void setFileType(List<FileTypeEnum> fileType) {
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
    if (!(object instanceof File)) {
      return false;
    }
    File other = (File) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.File[ id=" + id + " ]";
  }

}
