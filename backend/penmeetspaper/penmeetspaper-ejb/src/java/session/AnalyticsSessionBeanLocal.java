/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.EarningsAnalytics;
import entity.FollowersAnalytics;
import entity.SiteWideAnalytics;
import entity.SubscribersAnalytics;
import entity.ViewersAnalytics;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author carlc
 */
@Local
public interface AnalyticsSessionBeanLocal {

  public void createSiteWideAnalytics();

  public SiteWideAnalytics getSiteWideAnalytics();

  public FollowersAnalytics getFollowersAnalytics(Long personId) throws NoResultException, NotValidException;

  public SubscribersAnalytics getSubscribersAnalytics(Long personId) throws NoResultException, NotValidException;

  public EarningsAnalytics getEarningsAnalytics(Long personId) throws NoResultException, NotValidException;

  public ViewersAnalytics getViewersAnalytics(Long personId) throws NoResultException, NotValidException;

  public FollowersAnalytics createFollowersAnalytics();

  public SubscribersAnalytics createSubscribersAnalytics();

  public EarningsAnalytics createEarningsAnalytics();

  public ViewersAnalytics createViewersAnalytics();

}
