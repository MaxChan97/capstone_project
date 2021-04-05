/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.LiveChat;
import entity.LiveMessage;
import entity.Person;
import entity.Stream;
import entity.Trend;
import exception.NoResultException;
import exception.NotValidException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
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

  @EJB
  private TrendSessionBeanLocal trendSB;

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

    //Parse stream title and description for hashtags
    String[] titleHashtags = newStream.getTitle().split(" ");
    String[] descriptionHashtags = newStream.getDescription().split(" ");
    HashSet<String> hashtags = new HashSet<>();
    for (String word : titleHashtags) {
      if (!word.isEmpty() && word.startsWith("#") && word.length() > 1) {
        hashtags.add(word);
      }
    }
    for (String word : descriptionHashtags) {
      if (!word.isEmpty() && word.startsWith("#") && word.length() > 1) {
        hashtags.add(word);
      }
    }

    //Insert hashtags to existing trend; Create trend if it does not already exists
    List<Long> trends = new ArrayList<>();
    for (String hashtag : hashtags) {
      //Returns managed trend
      Trend trend = trendSB.insertHashtag(hashtag);
      newStream.getTrends().add(trend);
      trend.getStreams().add(newStream);
    }

    streamer.getStreams().add(newStream);

    em.flush();

    newStream.setStreamer(getDetachedPerson(newStream.getStreamer()));
    em.detach(newStream);
    newStream.setTrends(null);

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
  public LiveChat getLiveChatByStreamId(Long streamId) throws NoResultException, NotValidException {
    Stream stream = em.find(Stream.class, streamId);
    LiveChat liveChat = stream.getLiveChat();
    for (LiveMessage liveMessage : liveChat.getLiveMessages()) {
      liveMessage.setSender(getDetachedPerson(liveMessage.getSender()));
    }
    return liveChat;
  }

  @Override
  public void sendLiveChatMessage(Long streamId, Long senderId, String messageBody) {
    Stream stream = em.find(Stream.class, streamId);
    LiveChat liveChat = stream.getLiveChat();

    LiveMessage liveMessage = new LiveMessage();
    Person sender = em.find(Person.class, senderId);
    liveMessage.setBody(messageBody);
    liveMessage.setDate(new Date());
    liveMessage.setSender(sender);
    em.persist(liveMessage);

    liveChat.getLiveMessages().add(liveMessage);
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

      em.detach(stream);
      stream.setLiveChat(null);
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
