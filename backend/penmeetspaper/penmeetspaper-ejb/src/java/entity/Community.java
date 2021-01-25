/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import entity.viewEntities.CommunityPageView;
import enumeration.EducationLevelEnum;
import enumeration.TopicEnum;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

/**
 *
 * @author Shawn
 */
@Entity
public class Community implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @ManyToOne
    @JoinColumn(name = "owner")
    private Person owner;

    @Enumerated(EnumType.STRING)
    private List<TopicEnum> topicEnums = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private List<EducationLevelEnum> educationLevelEnums = new ArrayList<>();

    @OneToMany(mappedBy = "postCommunity")
    private List<Post> posts = new ArrayList<>();

    // Unidirectional
    @OneToMany
    private List<CommunityPageView> communityPageViews = new ArrayList<>();

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Person getOwner() {
        return owner;
    }

    public void setOwner(Person owner) {
        this.owner = owner;
    }

    public List<TopicEnum> getTopicEnums() {
        return topicEnums;
    }

    public void setTopicEnums(List<TopicEnum> topicEnums) {
        this.topicEnums = topicEnums;
    }

    public List<EducationLevelEnum> getEducationLevelEnums() {
        return educationLevelEnums;
    }

    public void setEducationLevelEnums(List<EducationLevelEnum> educationLevelEnums) {
        this.educationLevelEnums = educationLevelEnums;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public List<CommunityPageView> getCommunityPageViews() {
        return communityPageViews;
    }

    public void setCommunityPageViews(List<CommunityPageView> communityPageViews) {
        this.communityPageViews = communityPageViews;
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
        if (!(object instanceof Community)) {
            return false;
        }
        Community other = (Community) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Community[ id=" + id + " ]";
    }

}
