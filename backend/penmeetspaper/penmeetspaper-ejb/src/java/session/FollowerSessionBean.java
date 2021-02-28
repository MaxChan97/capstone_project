/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.personEntities.Person;
import entity.personToPersonEntities.Follow;
import exception.NoResultException;
import exception.NotValidException;
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
public class FollowerSessionBean implements FollowerSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
        if (personId == null) {
            throw new NotValidException(FollowerSessionBeanLocal.MISSING_PERSON_ID);
        }

        Person person = em.find(Person.class, personId);

        if (person == null) {
            throw new NoResultException(FollowerSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        return person;
    }

    private Follow getFollow(Long followerId, Long publisherId) throws NoResultException, NotValidException {
        Query q;
        q = em.createQuery("SELECT f FROM Follow f WHERE f.follower.id = :followerId AND f.publisher.id = :publisherId");
        q.setParameter("followerId", followerId);
        q.setParameter("publisherId", publisherId);

        List<Follow> followList = q.getResultList();

        if (followList.isEmpty()) {
            throw new NoResultException(FollowerSessionBeanLocal.CANNOT_FIND_FOLLOW);
        }

        if (followList.size() > 1) {
            throw new NotValidException(FollowerSessionBeanLocal.MULTIPLE_FOLLOW_FOUND);
        }

        return followList.get(0);

    }

    @Override
    public void followPerson(Long followerId, Long publisherId) throws NoResultException, NotValidException {

        // Check whether followEntity already exists
        Follow existingFollow = null;

        try {
            existingFollow = getFollow(followerId, publisherId);
        } catch (NoResultException e) {

        }

        if (existingFollow != null) {
            throw new NotValidException(FollowerSessionBeanLocal.FOLLOW_ALREADY_EXISTS);
        }

        Person follower = emGetPerson(followerId);

        Person publisher = emGetPerson(publisherId);

        Follow followEntity = new Follow();
        followEntity.setFollowDate(new Date());
        followEntity.setIsNotificationOn(true);

        followEntity.setFollower(follower);
        followEntity.setPublisher(publisher);

        em.persist(followEntity);

        publisher.getFollowers().add(followEntity);
        follower.getFollowing().add(followEntity);
    }

    @Override
    public void unfollowPerson(Long followerId, Long publisherId) throws NoResultException, NotValidException {
        // Check whether followEntity already exists

        Follow followEntity = getFollow(followerId, publisherId);

        Person follower = emGetPerson(followerId);

        Person publisher = emGetPerson(publisherId);

        publisher.getFollowers().remove(followEntity);
        follower.getFollowing().remove(followEntity);

        em.remove(followEntity);

    }
}
