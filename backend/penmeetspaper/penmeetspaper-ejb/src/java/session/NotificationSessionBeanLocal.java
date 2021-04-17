/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Notification;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author SHAWN LIM
 */
@Local
public interface NotificationSessionBeanLocal {

    public final static String MISSING_NOTI_ID = "Missing notification Id";
    public final static String CANNOT_FIND_NOTI = "Cannot find notification";

    public void createNotification(Notification noti, Long personId) throws NoResultException, NotValidException;

    public void readNotification(Long nId) throws NoResultException, NotValidException;

}
