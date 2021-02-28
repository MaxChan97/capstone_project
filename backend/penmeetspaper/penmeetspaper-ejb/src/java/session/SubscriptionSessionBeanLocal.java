/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author Shawn
 */
@Local
public interface SubscriptionSessionBeanLocal {

    public final static String MULTIPLE_SUBS_FOUND = "Multiple Subscription entities found";
    public final static String SUB_ALREADY_EXISTS = "Subscription Entity already exists";

    public final static String MISSING_PERSON_ID = "Missing person ID";

    public final static String CANNOT_FIND_PERSON = "Could not find person";
    public final static String CANNOT_FIND_SUB = "Could not find Subscription Entity that you were looking for";

    public void subscribeToPerson(Long subscriberId, Long publisherId) throws NoResultException, NotValidException;

    public void unsubscribeToPerson(Long subscriberId, Long publisherId) throws NoResultException, NotValidException;

}
