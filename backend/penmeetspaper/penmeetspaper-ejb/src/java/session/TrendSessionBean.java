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
import javax.ejb.EJB;
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
            //Returns managed trend
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
            //Returns unmanaged trend
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
        for (Trend t : trends) {
            //Returns unmanaged trend
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
        trends = trends.stream().filter(t -> t.getDateCount().containsKey(date)).sorted((t1, t2) -> t2.getDateCount().get(date).compareTo(t1.getDateCount().get(date))).collect(Collectors.toList());

        return trends.subList(0, Math.min(4, trends.size()));
    }

    @Override
    public Trend createTrend(String hashtag) {
        Trend newTrend = new Trend();
        newTrend.setHashTag(hashtag.toLowerCase());
        newTrend.setDateCount(new HashMap<Date, Long>());
        //newTrend.setPosts(new ArrayList<>());
        //newTrend.setStreams(new ArrayList<>());
        //newTrend.setVideos(new ArrayList<>());

        HashMap<Date, Long> dateCount = new HashMap<Date, Long>();
        newTrend.setDateCount(dateCount);
        em.persist(newTrend);
        em.flush();
        //Returns managed trend
        return newTrend;
    }

    @Override
    public Trend insertHashtag(String hashtag) {

        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date date = cal.getTime();

        try {
            Trend trend = getTrend(hashtag);
            //Trend already exists
            //Get trend, add relationships and persist
            trend.getDateCount().put(date, trend.getDateCount().getOrDefault(date, new Long(0)) + 1);
            em.flush();
            //Returns managed trend
            return trend;
        } catch (NoResultException e) {
            //Trend does not exists
            //Create a new trend, add relationships and persist
            Trend newTrend = createTrend(hashtag);
            newTrend.getDateCount().put(date, new Long(1));
            em.flush();
            //Returns managed trend
            return newTrend;
        }
    }

}
