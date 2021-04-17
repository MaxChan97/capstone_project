/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Notification;
import entity.Person;
import exception.NoResultException;
import exception.NotValidException;
import java.util.Date;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author SHAWN LIM
 */
@Stateless
public class NotificationSessionBean implements NotificationSessionBeanLocal {

    @PersistenceContext
    EntityManager em;

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

        em.persist(noti);
        em.flush();
    }

    public void readNotification(Long nId) throws NoResultException, NotValidException {
        Notification n = emGetNotification(nId);
        n.setRead(true);
        em.flush();
    }

}
