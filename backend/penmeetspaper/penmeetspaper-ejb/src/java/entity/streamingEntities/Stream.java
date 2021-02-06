/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity.streamingEntities;

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
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private boolean isPaid;

    @Column(nullable = false)
    private int viewerCount;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    @Column(nullable = false)
    private boolean hasEnded;

    // unidirectional
    @OneToOne
    private LiveChat liveChat;

    // unidirectional
    @OneToMany
    @JoinColumn(name = "livePoll_id")
    private List<LivePoll> polls = new ArrayList<>();

    // birectional
    @OneToOne(mappedBy = "streamStreaming")
    private Person streamer;

    // unidirectional
    @OneToMany
    @JoinColumn(name = "viewers_id")
    private List<Person> viewers = new ArrayList<>();

    // unidirectional
    @OneToMany
    @JoinColumn(name = "kickedUsers_id")
    private List<Person> kickedUsers = new ArrayList<>();

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

    public boolean isHasEnded() {
        return hasEnded;
    }

    public void setHasEnded(boolean hasEnded) {
        this.hasEnded = hasEnded;
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

    public List<LivePoll> getPolls() {
        return polls;
    }

    public void setPolls(List<LivePoll> polls) {
        this.polls = polls;
    }

    public List<Person> getKickedUsers() {
        return kickedUsers;
    }

    public void setKickedUsers(List<Person> kickedUsers) {
        this.kickedUsers = kickedUsers;
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
