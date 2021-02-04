/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import entity.personEntities.Person;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

/**
 *
 * @author carlc
 */
@Entity
public class Folder implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  // birectional
  @ManyToOne
  @JoinColumn(name = "owner")
  private Person owner;

  // birectional
  @ManyToOne
  @JoinColumn(name = "parentFolder_id")
  private Folder parentFolder;

  // birectional
  @OneToMany(mappedBy = "parentFolder")
  private List<Folder> childrenFolder = new ArrayList<>();

  // birectional
  @OneToMany(mappedBy = "folder")
  private List<File> files = new ArrayList<>();

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

  public Person getOwner() {
    return owner;
  }

  public void setOwner(Person owner) {
    this.owner = owner;
  }

  public Folder getParentFolder() {
    return parentFolder;
  }

  public void setParentFolder(Folder parentFolder) {
    this.parentFolder = parentFolder;
  }

  public List<Folder> getChildrenFolder() {
    return childrenFolder;
  }

  public void setChildrenFolder(List<Folder> childrenFolder) {
    this.childrenFolder = childrenFolder;
  }

  public List<File> getFiles() {
    return files;
  }

  public void setFiles(List<File> files) {
    this.files = files;
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
    if (!(object instanceof Folder)) {
      return false;
    }
    Folder other = (Folder) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "entity.Folder[ id=" + id + " ]";
  }

}
