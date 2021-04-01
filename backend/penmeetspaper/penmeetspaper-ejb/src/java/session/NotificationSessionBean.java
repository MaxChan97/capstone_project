/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Notification;
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

    @Override
    public void createNotification(Notification noti) {
        noti.setDateCreated(new Date());

        em.persist(noti);
        em.flush();
    }

}
