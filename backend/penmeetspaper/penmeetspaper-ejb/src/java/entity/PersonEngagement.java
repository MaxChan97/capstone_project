/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import entity.personEntities.Person;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 *
 * @author Shawn
 */
@Entity
public class PersonEngagement implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "personEngagement_person")
    private Person person;

    @ManyToOne
    @JoinColumn(name = "personEngagement_community")
    private Community community;

    @Column(nullable = false)
    private double postPoints;

    @Column(nullable = false)
    private double commentPoints;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Community getCommunity() {
        return community;
    }

    public void setCommunity(Community community) {
        this.community = community;
    }

    public double getPostPoints() {
        return postPoints;
    }

    public void setPostPoints(double postPoints) {
        this.postPoints = postPoints;
    }

    public double getCommentPoints() {
        return commentPoints;
    }

    public void setCommentPoints(double commentPoints) {
        this.commentPoints = commentPoints;
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
        if (!(object instanceof PersonEngagement)) {
            return false;
        }
        PersonEngagement other = (PersonEngagement) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.PersonEngagement[ id=" + id + " ]";
    }

}
