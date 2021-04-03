/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Trend;
import exception.NoResultException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author carlc
 */
@Stateless
public class TrendSessionBean implements TrendSessionBeanLocal {

  @PersistenceContext
  private EntityManager em;

  @Override
  public Trend getTrend(String hashtag) throws NoResultException {
    Query q;
    if (hashtag != null) {
      q = em.createQuery("SELECT t FROM Trend t WHERE LOWER(t.hashTag) = :hashtag");
      q.setParameter("hashtag", hashtag.toLowerCase());
    } else {
      q = em.createQuery("SELECT t FROM Trend t");
    }
    List<Trend> trends = q.getResultList();
    if (trends.size() > 0) {
      //Returns managed entity
      return trends.get(0);
    } else {
      throw new NoResultException(TrendSessionBeanLocal.CANNOT_FIND_TREND);
    }
  }

  @Override
  public List<Trend> getTopTrends() {
    Query q;
    q = em.createQuery("SELECT t FROM Trend t");
    List<Trend> trends = q.getResultList();
    trends.sort((t1, t2) -> t2.getPosts().size() + t2.getStreams().size() - t1.getPosts().size() - t1.getStreams().size());
    for (Trend t : trends) {
      //Returns unmanaged entity
      em.detach(t);
      t.setPosts(null);
      t.setStreams(null);
    }
    return trends.subList(0, Math.min(4, trends.size()));
  }

  @Override
  public List<Trend> getTodaysTrends() {
    Query q;
    q = em.createQuery("SELECT t FROM Trend t");
    List<Trend> trends = q.getResultList();
//    trends.sort((t1, t2) -> t2.getPosts().size() + t2.getStreams().size() - t1.getPosts().size() - t1.getStreams().size());
    for (Trend t : trends) {
      //Returns unmanaged entity
      em.detach(t);
      t.setPosts(null);
      t.setStreams(null);
    }
    Calendar cal = Calendar.getInstance();
    cal.set(Calendar.HOUR_OF_DAY, 0);
    cal.set(Calendar.MINUTE, 0);
    cal.set(Calendar.SECOND, 0);
    cal.set(Calendar.MILLISECOND, 0);
    Date date = cal.getTime();
    System.out.println(trends);
    trends = trends.stream().filter(t -> t.getDateCount().containsKey(date)).sorted((t1, t2) -> t2.getDateCount().get(date).compareTo(t1.getDateCount().get(date))).collect(Collectors.toList());
    System.out.println(trends);

    return trends.subList(0, Math.min(4, trends.size()));
  }

  @Override
  public Trend createTrend(String hashtag) {
    Trend newTrend = new Trend();
    newTrend.setHashTag(hashtag);
    newTrend.setDateCount(new HashMap<Date, Long>());
    newTrend.setPosts(new ArrayList<>());
    newTrend.setStreams(new ArrayList<>());

    HashMap<Date, Long> dateCount = new HashMap<Date, Long>();
    newTrend.setDateCount(dateCount);
    em.persist(newTrend);
    em.flush();
    //Returns managed entity
    return newTrend;
  }

}
