/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Person;
import entity.Trend;
import entity.Video;
import exception.NoResultException;
import exception.NotValidException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author carlc
 */
@Stateless
public class VideoSessionBean implements VideoSessionBeanLocal {

  @PersistenceContext
  private EntityManager em;

  @EJB
  private PersonSessionBeanLocal personSB;

  @EJB
  private TrendSessionBeanLocal trendSB;

  private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
    if (personId == null) {
      throw new NotValidException(VideoSessionBeanLocal.MISSING_PERSON_ID);
    }

    Person person = em.find(Person.class, personId);

    if (person == null) {
      throw new NoResultException(VideoSessionBeanLocal.CANNOT_FIND_PERSON);
    }

    return person;
  }
  
  @Override
  public void createVideoForPerson(Long personId, Video video) throws NoResultException, NotValidException {
    if (personId == null) {
      throw new NotValidException(VideoSessionBeanLocal.MISSING_PERSON_ID);
    }
    
    if (video == null) {
      throw new NotValidException(VideoSessionBeanLocal.MISSING_VIDEO);
    }

    //Parse video description for hashtags
    String[] words = video.getDescription().split(" ");
    HashSet<String> hashtags = new HashSet<>();
    for (String word : words) {
      if (!word.isEmpty() && word.startsWith("#") && word.length() > 1) {
        hashtags.add(word);
      }
    }

    for (String hashtag : hashtags) {
      Trend trend = trendSB.insertHashtag(hashtag);
      video.getTrends().add(trend);
      trend.getVideos().add(video);
    }
    
    Person author = emGetPerson(personId);
    video.setAuthor(author);
    em.persist(video);
    author.getVideosCreated().add(video);

    personSB.addContributorPointsToPerson(personId, 5.0);
    personSB.checkBadgeQualification(personId);
    em.flush();

  } // end createVideoForPerson

  
  @Override
  public List<Video> getPersonsVideos(Long personId) throws NoResultException, NotValidException {
    Person person = emGetPerson(personId);

    List<Video> videos = person.getVideosCreated();

    List<Video> results = new ArrayList<>();

    for (Video v : videos) {
      em.detach(v);
      results.add(v);
    }
    return results;
  }
}
