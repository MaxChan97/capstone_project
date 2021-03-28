/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Person;
import entity.Subscription;
import exception.NoResultException;
import exception.NotValidException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Shawn
 */
@Stateless
public class SubscriptionSessionBean implements SubscriptionSessionBeanLocal {

  @PersistenceContext
  private EntityManager em;

  private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
    if (personId == null) {
      throw new NotValidException(SubscriptionSessionBeanLocal.MISSING_PERSON_ID);
    }

    Person person = em.find(Person.class, personId);

    if (person == null) {
      throw new NoResultException(SubscriptionSessionBeanLocal.CANNOT_FIND_PERSON);
    }

    return person;
  }

  private Subscription setStartEndDate(Subscription s) {
    Date today = new Date();
    s.setStartDate(today);

    Calendar cal = Calendar.getInstance();
    cal.add(Calendar.MONTH, 1);
    Date endDate = cal.getTime();
    s.setEndDate(endDate);

    return s;
  }

  private Subscription getSubscription(Long subscriberId, Long publisherId) throws NoResultException, NotValidException {
    Query q;
    q = em.createQuery("SELECT s FROM Subscription s WHERE s.subscriber.id = :subscriberId AND s.publisher.id = :publisherId");
    q.setParameter("subscriberId", subscriberId);
    q.setParameter("publisherId", publisherId);

    List<Subscription> subscriptionList = q.getResultList();

    if (subscriptionList.isEmpty()) {
      throw new NoResultException(SubscriptionSessionBeanLocal.CANNOT_FIND_SUB);
    }

    if (subscriptionList.size() > 1) {
      throw new NotValidException(SubscriptionSessionBeanLocal.MULTIPLE_SUBS_FOUND);
    }

    return subscriptionList.get(0);

  }

  @Override
  public void subscribeToPerson(Long subscriberId, Long publisherId) throws NoResultException, NotValidException {
    // Check whether Subscription already exists
    Subscription existingSubscription = null;

    try {
      existingSubscription = getSubscription(subscriberId, publisherId);
    } catch (NoResultException e) {

    }

    if (existingSubscription != null && !existingSubscription.isIsTerminated()) {

      throw new NotValidException(SubscriptionSessionBeanLocal.SUB_ALREADY_EXISTS);

    } else if (existingSubscription != null && existingSubscription.isIsTerminated()) {

      // existing subscription that is terminated
      existingSubscription.setIsTerminated(false);
      return;
    }

    Person subscriber = emGetPerson(subscriberId);

    Person publisher = emGetPerson(publisherId);

    Subscription newSubscription = new Subscription();

    newSubscription = setStartEndDate(newSubscription);
    newSubscription.setIsNotificationOn(true);
    newSubscription.setIsTerminated(false);
    newSubscription.setSubscriber(subscriber);
    newSubscription.setPublisher(publisher);

    newSubscription.setPricingPlan(publisher.getPricingPlan());

    em.persist(newSubscription);

    subscriber.getSubscriptions().add(newSubscription);
    publisher.getPublications().add(newSubscription);

    Calendar cal = Calendar.getInstance();
    cal.set(Calendar.HOUR_OF_DAY, 0);
    cal.set(Calendar.MINUTE, 0);
    cal.set(Calendar.SECOND, 0);
    cal.set(Calendar.MILLISECOND, 0);

    Date date = cal.getTime();
    Long newSubscriberCount = publisher.getSubscriptions().stream().filter(s -> !s.isIsTerminated()).count();
    publisher.getSubscribersAnalytics().getSubscribersCount().put(date, newSubscriberCount);

  }

  @Override
  public void unsubscribeToPerson(Long subscriberId, Long publisherId) throws NoResultException, NotValidException {
    Subscription subscription = getSubscription(subscriberId, publisherId);

    subscription.setIsTerminated(true);

    Person publisher = emGetPerson(publisherId);

    Calendar cal = Calendar.getInstance();
    cal.set(Calendar.HOUR_OF_DAY, 0);
    cal.set(Calendar.MINUTE, 0);
    cal.set(Calendar.SECOND, 0);
    cal.set(Calendar.MILLISECOND, 0);

    Date date = cal.getTime();
    Long newSubscriberCount = publisher.getSubscriptions().stream().filter(s -> !s.isIsTerminated()).count();
    publisher.getSubscribersAnalytics().getSubscribersCount().put(date, newSubscriberCount);
  }

  @Override
  public String isSubscribed(Long subscriberId, Long publisherId) throws NotValidException {

    try {
      Subscription subscription = getSubscription(subscriberId, publisherId);

      if (subscription.isIsTerminated()) {
        return "ReSubscribe";
      } else {
        return "Subscribed";
      }

    } catch (NoResultException e) {
      return "NotSubscribed";
    }

  }
}
