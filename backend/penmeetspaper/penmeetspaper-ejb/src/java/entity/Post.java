/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import entity.personEntities.Person;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;

/**
 *
 * @author Shawn
 */
@Entity
public class Post implements Serializable, Comparable<Post> {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(nullable = false)
    private String body;

    @Column(nullable = false)
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date datePosted;

    // unidirectional
    @OneToMany
    @JoinColumn(name = "likes_post")
    private List<Person> likes = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "person_posts")
    private Person author;

    // unidirectional
    @OneToMany
    @JoinColumn(name = "comment_id")
    private List<Comment> comments = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "postCommunity")
    private Community postCommunity;
    // unidirectional
    @OneToMany
    @JoinColumn(name = "media_id")
    private List<Media> media = new ArrayList<>();

    // unidirectional | nullable
    @OneToOne
    private Poll poll;

    @ManyToMany
    private List<Trend> trends = new ArrayList<>();

    private String fileName;

    private String fileUrl;

    private String fileType;

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

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Person getAuthor() {
        return author;
    }

    public void setAuthor(Person author) {
        this.author = author;
    }

    public List<Person> getLikes() {
        return likes;
    }

    public void setLikes(List<Person> likes) {
        this.likes = likes;
    }

    public Community getPostCommunity() {
        return postCommunity;
    }

    public void setPostCommunity(Community postCommunity) {
        this.postCommunity = postCommunity;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<Media> getMedia() {
        return media;
    }

    public void setMedia(List<Media> media) {
        this.media = media;
    }

    public Poll getPoll() {
        return poll;
    }

    public void setPoll(Poll poll) {
        this.poll = poll;
    }

    public List<Trend> getTrends() {
        return trends;
    }

    public void setTrends(List<Trend> trends) {
        this.trends = trends;
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
        if (!(object instanceof Post)) {
            return false;
        }
        Post other = (Post) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Post[ id=" + id + " ]";
    }

    /**
     * @return the datePosted
     */
    public Date getDatePosted() {
        return datePosted;
    }

    /**
     * @param datePosted the datePosted to set
     */
    public void setDatePosted(Date datePosted) {
        this.datePosted = datePosted;
    }

    @Override
    public int compareTo(Post p) {
        return this.getDatePosted().compareTo(p.getDatePosted());
    }

}
