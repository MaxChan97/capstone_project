/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity.streamingEntities;

import entity.PersonAnswer;
import entity.personEntities.Person;
import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.MapKeyColumn;

/**
 *
 * @author Shawn
 */
@Entity
public class LivePoll implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false)
    private boolean isActive;

    @ManyToMany
    @MapKeyColumn(name = "option")
    private Map<String, PersonAnswer> options = new HashMap();

    @ManyToMany
    private Set<Person> pollers = new HashSet<Person>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "entity.streamingEntities.LivePoll[ id=" + id + " ]";
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public Map<String, PersonAnswer> getOptions() {
        return options;
    }

    public void setOptions(Map<String, PersonAnswer> options) {
        this.options = options;
    }

    public Set<Person> getPollers() {
        return pollers;
    }

    public void setPollers(Set<Person> pollers) {
        this.pollers = pollers;
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
        if (!(object instanceof LivePoll)) {
            return false;
        }
        LivePoll other = (LivePoll) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }
}
