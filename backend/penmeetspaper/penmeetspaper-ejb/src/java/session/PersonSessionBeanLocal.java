/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Community;
import entity.Post;
import entity.personEntities.Person;
import entity.personToPersonEntities.Follow;
import entity.personToPersonEntities.Subscription;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author carlc
 */
@Local
public interface PersonSessionBeanLocal {

    public final static String PERSON_ALREADY_CREATED = "Person has already been created";
    public final static String CANNOT_FIND_PERSON = "Cannot find person";
    public final static String MISSING_USERNAME = "Missing person username";
    public final static String MISSING_PASSWORD = "Missing person password";
    public final static String MISSING_PERSON_ID = "Missing person id";
    public final static String MISSING_EMAIL = "Missing person email";
    public final static String MISSING_PERSON = "Missing person parameter";
    public final static String MISSING_RESET_ID = "Missing reset id";
    public final static String EMAIL_TAKEN = "Email taken";
    public final static String USERNAME_TAKEN = "Username taken";
    public final static String WRONG_PASSWORD = "Wrong password";

    public Person createPerson(Person person) throws NotValidException;

    public List<Person> searchPersonByUsername(String username) throws NoResultException, NotValidException;

    public Person getPersonById(Long pId) throws NoResultException, NotValidException;

    public void updatePerson(Person person) throws NoResultException, NotValidException;

    public void deletePerson(Long id) throws NoResultException, NotValidException;

    public void updatePricingPlan(Person person) throws NoResultException, NotValidException;

    public List<Follow> getFollowing(Long personId) throws NoResultException, NotValidException;

    public List<Follow> getFollowers(Long personId) throws NoResultException, NotValidException;

    public List<Subscription> getSubscription(Long personId) throws NoResultException, NotValidException;

    public List<Subscription> getPublications(Long personId) throws NoResultException, NotValidException;

    public List<Community> getFollowingAndOwnedCommunities(Long personId) throws NoResultException, NotValidException;

    public List<Community> getFollowingCommunities(Long personId) throws NoResultException, NotValidException;

    public List<Community> getOwnedCommunities(Long personId) throws NoResultException, NotValidException;

    public Person getPersonByEmail(String email) throws NoResultException, NotValidException;

    public List<Post> getFollowingPosts(Long personId) throws NoResultException, NotValidException;

    public Person getPersonByResetId(String resetId) throws NoResultException, NotValidException;

    public List<Post> getPersonsPost(Long personId) throws NoResultException, NotValidException;

    public void onboarding(Person person) throws NoResultException, NotValidException;

    public List<Post> getFollowingCommunityPosts(Long personId) throws NoResultException, NotValidException;

}
