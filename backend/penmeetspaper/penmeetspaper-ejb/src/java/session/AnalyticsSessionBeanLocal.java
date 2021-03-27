/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.FollowersAnalytics;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author carlc
 */
@Local
public interface AnalyticsSessionBeanLocal {

  public FollowersAnalytics getFollowersAnalytics(Long personId) throws NoResultException, NotValidException;
  
}
