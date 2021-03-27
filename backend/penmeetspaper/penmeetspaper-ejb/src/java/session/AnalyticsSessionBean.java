/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.FollowersAnalytics;
import entity.Person;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author carlc
 */
@Stateless
public class AnalyticsSessionBean implements AnalyticsSessionBeanLocal {

  @PersistenceContext
  private EntityManager em;

  private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
    if (personId == null) {
      throw new NotValidException(PersonSessionBeanLocal.MISSING_PERSON_ID);
    }

    Person person = em.find(Person.class, personId);

    if (person == null) {
      throw new NoResultException(PersonSessionBeanLocal.CANNOT_FIND_PERSON);
    }

    return person;
  }

  @Override
  public FollowersAnalytics getFollowersAnalytics(Long personId) throws NoResultException, NotValidException {
    Person person = emGetPerson(personId);
    return person.getFollowersAnalytics();
  }
}
