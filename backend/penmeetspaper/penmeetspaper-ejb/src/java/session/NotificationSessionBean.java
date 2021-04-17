/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Follow;
import entity.Notification;
import entity.Person;
import entity.Subscription;
import exception.NoResultException;
import exception.NotValidException;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author SHAWN LIM
 */
@Stateless
public class NotificationSessionBean implements NotificationSessionBeanLocal {

    @PersistenceContext
    EntityManager em;

    @EJB
    PersonSessionBeanLocal personSB;

    @EJB
    AdminLogSessionBeanLocal adminLogSB;

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

    private Notification emGetNotification(Long nId) throws NoResultException, NotValidException {
        if (nId == null) {
            throw new NotValidException(NotificationSessionBeanLocal.MISSING_NOTI_ID);
        }

        Notification notification = em.find(Notification.class, nId);

        if (notification == null) {
            throw new NoResultException(NotificationSessionBeanLocal.CANNOT_FIND_NOTI);
        }

        return notification;
    }

    @Override
    public void createNotification(Notification noti, Long personId) throws NoResultException, NotValidException {
        Person p = emGetPerson(personId);

        noti.setRead(false);
        noti.setDateCreated(new Date());
        p.getNotifications().add(noti);
        int unreadNotifications = p.getUnreadNotifications() + 1;
        p.setUnreadNotifications(unreadNotifications);

        em.persist(noti);
        em.flush();
    }

    @Override
    public void readNotification(Long nId) throws NoResultException, NotValidException {
        Notification n = emGetNotification(nId);
        n.setRead(true);
        em.flush();
    }

    @Override
    public void createNotificationForFollowers(String body, String redirectTo, Long personId) throws NoResultException, NotValidException {
        List<Follow> followers = personSB.getFollowers(personId);

        for (Follow f : followers) {
            Person follower = f.getFollower();
            Notification n = new Notification();
            n.setBody(body);
            n.setRedirectTo(redirectTo);
            createNotification(n, follower.getId());
        }
    }

    @Override
    public void createNotificationForSubscribers(String body, String redirectTo, Long personId) throws NoResultException, NotValidException {
        List<Subscription> subs = personSB.getPublications(personId);

        for (Subscription s : subs) {
            Person subscriber = s.getSubscriber();
            Notification n = new Notification();
            n.setBody(body);
            n.setRedirectTo(redirectTo);
            createNotification(n, subscriber.getId());
        }
    }

    @Override
    public void createSystemWideNotification(String body, String redirectTo) throws NoResultException, NotValidException {

        Query q = em.createQuery("SELECT p FROM Person p");
        List<Person> personList = q.getResultList();
        for (Person p : personList) {
            Notification n = new Notification();
            n.setBody(body);
            n.setRedirectTo(redirectTo);
            createNotification(n, p.getId());
        }
    }

}
