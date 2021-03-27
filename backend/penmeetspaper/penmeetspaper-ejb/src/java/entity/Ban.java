/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import entity.Person;
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
 * @author Shawn
 */
@Entity
public class Ban implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int numBan;

    @OneToMany
    @JoinColumn(name = "ban_personId")
    private List<Person> banList = new ArrayList();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    /**
     * @return the numBan
     */
    public int getNumBan() {
        return numBan;
    }

    /**
     * @param numBan the numBan to set
     */
    public void setNumBan(int numBan) {
        this.numBan = numBan;
    }

    public List<Person> getBanList() {
        return banList;
    }

    public void setBanList(List<Person> banList) {
        this.banList = banList;
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
        if (!(object instanceof Ban)) {
            return false;
        }
        Ban other = (Ban) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Ban[ id=" + id + " ]";
    }

}
