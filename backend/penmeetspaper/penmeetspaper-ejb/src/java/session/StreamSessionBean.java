/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.LiveChat;
import entity.LiveMessage;
import entity.LivePoll;
import entity.Person;
import entity.PersonAnswer;
import entity.Stream;
import entity.Trend;
import enumeration.TopicEnum;
import exception.NoResultException;
import exception.NotValidException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

    @EJB
    private AnalyticsSessionBeanLocal analyticsSB;

    @PersistenceContext
    private EntityManager em;

    private Person getDetachedPerson(Person p) throws NoResultException, NotValidException {
        return personSB.getPersonById(p.getId());
    }

    @Override
    public Stream createStream(Long streamerId, String streamTitle, String streamDescription, Boolean isPaid,
            String accessUrl, String thumbnailUrl, List<TopicEnum> relatedTopics) throws NoResultException, NotValidException {
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
        newStream.setRelatedTopics(relatedTopics);
        em.persist(newStream);

        streamer.getStreams().add(newStream);

        // Parse stream title and description for hashtags
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

        // Insert hashtags to existing trend; Create trend if it does not already exists
        List<Long> trends = new ArrayList<>();
        for (String hashtag : hashtags) {
            // Returns managed trend
            Trend trend = trendSB.insertHashtag(hashtag);
            newStream.getTrends().add(trend);
            trend.getStreams().add(newStream);
        }

        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date date = cal.getTime();

        // Site-wide streams
        Long oldCount = analyticsSB.getSiteWideAnalytics().getStreamsCount().getOrDefault(date, new Long(0));
        analyticsSB.getSiteWideAnalytics().getStreamsCount().put(date, oldCount + 1);

        // Add contributor points
        personSB.addCCPointsToPerson(streamerId, 10);
        personSB.checkBadgeQualification(streamerId);

        em.flush();

        em.detach(newStream);
        newStream.setStreamer(getDetachedPerson(newStream.getStreamer()));
        for (Trend trend : newStream.getTrends()) {
            em.detach(trend);
            trend.setPosts(null);
            trend.setStreams(null);
            trend.setVideos(null);
        }

        return newStream;
    }

    @Override
    public void addLivePollToStream(Long streamId, LivePoll livePoll) {
        Stream stream = em.find(Stream.class, streamId);
        stream.getPolls().add(livePoll);
    }

    @Override
    public void endLivePoll(Long livePollId) {
        LivePoll livePoll = em.find(LivePoll.class, livePollId);
        livePoll.setIsActive(false);
    }

    @Override
    public void endStream(Long streamId) {
        Stream stream = em.find(Stream.class, streamId);
        stream.setHasEnded(true);
    }

    @Override
    public Stream getStreamById(Long streamId) throws NoResultException, NotValidException {
        Stream stream = em.find(Stream.class, streamId);
        stream.getTrends().size();
        em.detach(stream);
        stream.setStreamer(getDetachedPerson(stream.getStreamer()));
        System.out.println(stream.getTrends());
        for (Trend trend : stream.getTrends()) {
            em.detach(trend);
            trend.setPosts(null);
            trend.setStreams(null);
            trend.setVideos(null);
        }

        for (Person viewer : stream.getViewers()) {
            viewer = getDetachedPerson(viewer);
        }

        for (Person currentViewer : stream.getCurrentViewers()) {
            currentViewer = getDetachedPerson(currentViewer);
        }

        for (Person kickedUser : stream.getKickedUsers()) {
            kickedUser = getDetachedPerson(kickedUser);
        }
        em.detach(stream.getLiveChat());
        stream.setLiveChat(null);
        stream.setPolls(null);
        return stream;
    }
    
    @Override
    public List<Stream> getStreamsByTrend(String hashtag) throws NoResultException, NotValidException {
        Trend trend = trendSB.getTrend(hashtag);
        em.detach(trend);
        for (Stream stream : trend.getStreams()) {
            stream = getStreamById(stream.getId());
        }
        return trend.getStreams();
    }

    @Override
    public LivePoll getActiveLivePollByStreamId(Long streamId) throws NoResultException, NotValidException {
        Stream stream = em.find(Stream.class, streamId);
        List<LivePoll> livePolls = stream.getPolls();
        for (LivePoll livePoll : livePolls) {
            if (livePoll.isIsActive() == true) {
                em.detach(livePoll);
                Set<Person> pollers = livePoll.getPollers();

                for (Person person : pollers) {
                    person = getDetachedPerson(person);
                }

                for (PersonAnswer pa : livePoll.getOptions().values()) {
                    em.detach(pa);
                    List<Person> answeredBy = pa.getAnsweredBy();
                    for (Person person : answeredBy) {
                        person = getDetachedPerson(person);
                    }
                }

                return livePoll;
            }
        }
        return null;
    }

    @Override
    public LiveChat getLiveChatByStreamId(Long streamId) throws NoResultException, NotValidException {
        Stream stream = em.find(Stream.class, streamId);
        LiveChat liveChat = stream.getLiveChat();
        for (LiveMessage liveMessage : liveChat.getLiveMessages()) {
            em.detach(liveMessage);
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
            stream = getStreamById(stream.getId());
        }
        return streams;
    }

    @Override
    public List<Stream> getPersonOngoingStreams(Long personId) throws NoResultException, NotValidException {
        Query query = em.createQuery("SELECT s FROM Stream s WHERE s.streamer.id = :personId AND s.hasEnded = false");
        query.setParameter("personId", personId);
        List<Stream> streams = query.getResultList();
        for (Stream stream : streams) {
            stream = getStreamById(stream.getId());
        }
        return streams;
    }

    @Override
    public void editStreamInfo(Long streamId, String newStreamTitle, String newStreamDescription, List<TopicEnum> relatedTopics) {
        Stream stream = em.find(Stream.class, streamId);
        stream.setTitle(newStreamTitle);
        stream.setDescription(newStreamDescription);
        stream.setRelatedTopics(relatedTopics);
    }

    @Override
    public void handleEnterStream(Long streamId, Long personId) {
        Stream stream = em.find(Stream.class, streamId);
        Person person = em.find(Person.class, personId);

        for (Person currentViewer : stream.getCurrentViewers()) {
            if (currentViewer.getId() == person.getId()) {
                // this person is already in the stream page, is just a refresh
                return;
            }
        }

        for (Person viewer : stream.getViewers()) {
            if (viewer.getId() == person.getId()) {
                // This guy visited this page before
                stream.getCurrentViewers().add(person);
                stream.setViewerCount(stream.getViewerCount() + 1);
                return;
            }
        }

        // New visitor
        stream.getViewers().add(person);
        stream.getCurrentViewers().add(person);
        stream.setViewerCount(stream.getViewerCount() + 1);

        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date date = cal.getTime();

        // User-views analytics
        Person streamer = stream.getStreamer();
        Long oldCount = streamer.getViewersAnalytics().getViewersCount().getOrDefault(date, new Long(0));
        streamer.getViewersAnalytics().getViewersCount().put(date, oldCount + 1);

    }

    @Override
    public void handleExitStream(Long streamId, Long personId) {
        Stream stream = em.find(Stream.class, streamId);
        Person person = em.find(Person.class, personId);

        boolean gotRemove = stream.getCurrentViewers().remove(person);
        if (gotRemove == true) {
            stream.setViewerCount(stream.getViewerCount() - 1);
        }
    }

    @Override
    public void kickUserFromStream(Long streamId, Long personId) {
        Stream stream = em.find(Stream.class, streamId);
        Person person = em.find(Person.class, personId);
        stream.getKickedUsers().add(person);
    }

    @Override
    public void unkickUserFromStream(Long streamId, Long personId) {
        Stream stream = em.find(Stream.class, streamId);
        Person person = em.find(Person.class, personId);
        boolean gotRemove = stream.getKickedUsers().remove(person);
        System.out.println(gotRemove);
    }

    @Override
    public List<Stream> searchStreamByTitleAndDescription(String searchString) throws NoResultException, NotValidException {
        Query q;
        if (searchString != null) {
            q = em.createQuery("SELECT s FROM Stream s WHERE LOWER(s.title) LIKE :searchString OR LOWER(s.description) LIKE :searchString");
            q.setParameter("searchString", "%" + searchString.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT s FROM Stream s");
        }
        List<Stream> streamList = q.getResultList();
        for (Stream s : streamList) {
            s = getStreamById(s.getId());
        }
        
        return streamList;
    }
}
