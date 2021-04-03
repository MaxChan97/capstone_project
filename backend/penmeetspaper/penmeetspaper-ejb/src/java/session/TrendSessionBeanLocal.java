/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Trend;
import exception.NoResultException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author carlc
 */
@Local
public interface TrendSessionBeanLocal {

  public final static String CANNOT_FIND_TREND = "Cannot find trend";

  public Trend getTrend(String hashtag) throws NoResultException;

  public Trend createTrend(String hashtag);

  public List<Trend> getTopTrends();

  public List<Trend> getTodaysTrends();

}
