/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.LiveChat;
import entity.Person;
import entity.Stream;
import exception.NoResultException;
import exception.NotValidException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Max
 */
@Stateless
public class StreamSessionBean implements StreamSessionBeanLocal {

    @EJB
    private PersonSessionBeanLocal personSB;

    @PersistenceContext
    private EntityManager em;
    
    private Person getDetachedPerson(Person p) throws NoResultException, NotValidException {
        return personSB.getPersonById(p.getId());
    }
    
    @Override
    public Stream createStream(Long streamerId, String streamTitle, String streamDescription, Boolean isPaid, String accessUrl, String thumbnailUrl) throws NoResultException, NotValidException {
        Person streamer = em.find(Person.class, streamerId);
        
        LiveChat liveChat = new LiveChat();
        em.persist(liveChat);
        
        Stream newStream = new Stream();
        newStream.setStreamer(streamer);
        newStream.setTitle(streamTitle);
        newStream.setDescription(streamDescription);
        newStream.setIsPaid(isPaid);
        newStream.setViewerCount(0);
        newStream.setDate(new Date());
        newStream.setHasEnded(false);
        newStream.setLiveChat(liveChat);
        newStream.setAccessUrl(accessUrl);
        newStream.setThumbnailUrl(thumbnailUrl);
        em.persist(newStream);
        
        streamer.getStreams().add(newStream);
        
        em.flush();
        
        newStream.setStreamer(getDetachedPerson(newStream.getStreamer()));
        
        return newStream;
    }
    
    @Override
    public void endStream(Long streamId) {
        Stream stream = em.find(Stream.class, streamId);
        stream.setHasEnded(true);
    }
    
    @Override
    public Stream getStreamById(Long streamId) throws NoResultException, NotValidException {
        Stream stream = em.find(Stream.class, streamId);
        stream.setStreamer(getDetachedPerson(stream.getStreamer()));
        return stream;
    }
    
    @Override
    public List<Stream> getOngoingStreams() throws NoResultException, NotValidException {
        Query query = em.createQuery("SELECT s FROM Stream s WHERE s.hasEnded = false");
        List<Stream> streams = query.getResultList();
        for (Stream stream : streams) {
            stream.setStreamer(getDetachedPerson(stream.getStreamer()));
            
            List<Person> viewers = new ArrayList<>();
            for (Person viewer : stream.getViewers()) {
                viewers.add(getDetachedPerson(viewer));
            }
            stream.setViewers(viewers);
            
            List<Person> kickedUsers = new ArrayList<>();
            for (Person kickedUser : stream.getKickedUsers()) {
                kickedUsers.add(getDetachedPerson(kickedUser));
            }
            stream.setKickedUsers(kickedUsers);
        }
        return streams;
    }
    
    @Override
    public List<Stream> getPersonOngoingStreams(Long personId) throws NoResultException, NotValidException {
        Query query = em.createQuery("SELECT s FROM Stream s WHERE s.streamer.id = :personId AND s.hasEnded = false");
        query.setParameter("personId", personId);
        List<Stream> streams = query.getResultList();
        for (Stream stream : streams) {
            stream.setStreamer(getDetachedPerson(stream.getStreamer()));
            
            List<Person> viewers = new ArrayList<>();
            for (Person viewer : stream.getViewers()) {
                viewers.add(getDetachedPerson(viewer));
            }
            stream.setViewers(viewers);
            
            List<Person> kickedUsers = new ArrayList<>();
            for (Person kickedUser : stream.getKickedUsers()) {
                kickedUsers.add(getDetachedPerson(kickedUser));
            }
            stream.setKickedUsers(kickedUsers);
        }
        return streams;
    }
    
    @Override
    public void editStreamInfo(Long streamId, String newStreamTitle, String newStreamDescription) {
        Stream stream = em.find(Stream.class, streamId);
        stream.setTitle(newStreamTitle);
        stream.setDescription(newStreamDescription);
    }
}
