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
 * @author shawn
 */
@Local
public interface FollowerSessionBeanLocal {

    public final static String MULTIPLE_FOLLOW_FOUND = "Multiple Follow entities found";
    public final static String FOLLOW_ALREADY_EXISTS = "Follow Entity already exists";

    public final static String MISSING_PERSON_ID = "Missing person ID";

    public final static String CANNOT_FIND_PERSON = "Could not find person";
    public final static String CANNOT_FIND_FOLLOW = "Could not find follow Entity that you were looking for";

    public void followPerson(Long followerId, Long publisherId) throws NoResultException, NotValidException;

    public void unfollowPerson(Long followerId, Long publisherId) throws NoResultException, NotValidException;
}
