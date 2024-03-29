/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import enumeration.TopicEnum;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
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
    private String title;

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

    @Column(nullable = false)
    private String accessUrl;

    @Column(nullable = false)
    private String thumbnailUrl;

    @Enumerated(EnumType.STRING)
    private List<TopicEnum> relatedTopics = new ArrayList<>();

    // unidirectional
    @OneToOne
    private LiveChat liveChat;

    // unidirectional
    @OneToMany
    @JoinColumn(name = "livePoll_id")
    private List<LivePoll> polls = new ArrayList<>();

    // birectional
    @ManyToOne
    private Person streamer;

    // unidirectional
    @ManyToMany
    @JoinTable(name = "STREAM_VIEWERS")
    private List<Person> viewers = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "STREAM_CURRENTVIEWERS")
    private List<Person> currentViewers = new ArrayList<>();

    // unidirectional
    @OneToMany
    @JoinColumn(name = "kickedUsers_id")
    private List<Person> kickedUsers = new ArrayList<>();

    @ManyToMany(mappedBy = "streams")
    private List<Trend> trends = new ArrayList<>();

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

    public List<Trend> getTrends() {
        return trends;
    }

    public void setTrends(List<Trend> trends) {
        this.trends = trends;
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

    /**
     * @return the accessUrl
     */
    public String getAccessUrl() {
        return accessUrl;
    }

    /**
     * @param accessUrl the accessUrl to set
     */
    public void setAccessUrl(String accessUrl) {
        this.accessUrl = accessUrl;
    }

    /**
     * @return the thumbnailUrl
     */
    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    /**
     * @param thumbnailUrl the thumbnailUrl to set
     */
    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    /**
     * @return the currentViewers
     */
    public List<Person> getCurrentViewers() {
        return currentViewers;
    }

    /**
     * @param currentViewers the currentViewers to set
     */
    public void setCurrentViewers(List<Person> currentViewers) {
        this.currentViewers = currentViewers;
    }

    /**
     * @return the relatedTopics
     */
    public List<TopicEnum> getRelatedTopics() {
        return relatedTopics;
    }

    /**
     * @param relatedTopics the relatedTopics to set
     */
    public void setRelatedTopics(List<TopicEnum> relatedTopics) {
        this.relatedTopics = relatedTopics;
    }

}
