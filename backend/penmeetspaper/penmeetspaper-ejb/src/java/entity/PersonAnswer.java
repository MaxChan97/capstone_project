/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

/**
 *
 * @author User
 */
@Entity
public class PersonAnswer implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // unidirectional
    @OneToMany
    @JoinColumn(name = "person_answer")
    private List<Person> answeredBy = new ArrayList<>();
    
    private Long numAnswered = new Long(0);

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Person> getAnsweredBy() {
        return answeredBy;
    }

    public void setAnsweredBy(List<Person> answeredBy) {
        this.answeredBy = answeredBy;
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
        if (!(object instanceof PersonAnswer)) {
            return false;
        }
        PersonAnswer other = (PersonAnswer) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.PersonAnswer[ id=" + id + " ]";
    }

    /**
     * @return the numAnswered
     */
    public Long getNumAnswered() {
        return numAnswered;
    }

    /**
     * @param numAnswered the numAnswered to set
     */
    public void setNumAnswered(Long numAnswered) {
        this.numAnswered = numAnswered;
    }

}
