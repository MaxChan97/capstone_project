/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Community;
import entity.Post;
import entity.personEntities.Person;
import entity.personToPersonEntities.Ban;
import entity.personToPersonEntities.Follow;
import entity.personToPersonEntities.Subscription;
import exception.NoResultException;
import exception.NotValidException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author carlc
 */
@Stateless
public class PersonSessionBean implements PersonSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @EJB
    private BanSessionBeanLocal banSB;

    @EJB
    private CommunitySessionBeanLocal communitySB;

    @EJB
    private PostSessionBeanLocal postSB;

    private Post getDetachedPost(Post p) throws NoResultException, NotValidException {
        return postSB.getPostById(p.getId());
    }

    private Post getDetachedCommunityPost(Post p) throws NoResultException, NotValidException {
        return postSB.getPostById(p.getId(), true);
    }

    private Community getDetachedCommunity(Community c) throws NoResultException, NotValidException {
        return communitySB.getCommunityById(c.getId());
    }

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

    private Person emGetPersonByEmail(String email) throws NoResultException, NotValidException {
        if (email == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_EMAIL);
        }

        Query q;
        q = em.createQuery("SELECT p from Person p WHERE p.email =:email");
        q.setParameter("email", email);

        List<Person> personList = q.getResultList();

        if (personList.size() == 0) {
            throw new NoResultException(PersonSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        for (Person p : personList) {
            p = getPersonById(p.getId());
        }

        return personList.get(0);
    }

    private Person emGetPersonByResetId(String resetId) throws NoResultException, NotValidException {
        if (resetId == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_RESET_ID);
        }

        Query q;
        q = em.createQuery("SELECT p from Person p WHERE p.resetId =:resetId");
        q.setParameter("resetId", resetId);

        List<Person> personList = q.getResultList();

        if (personList.size() == 0) {
            throw new NoResultException(PersonSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        for (Person p : personList) {
            p = getPersonById(p.getId());
        }

        return personList.get(0);
    }

    @Override
    public Person createPerson(Person person) throws NotValidException {
        if (person == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_PERSON);
        }

        if (person.getUsername() == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_USERNAME);
        }

        Query q;
        q = em.createQuery("SELECT p from Person p WHERE p.email =:email");
        q.setParameter("email", person.getEmail());
        if (q.getResultList().size() > 0) {
            throw new NotValidException(PersonSessionBeanLocal.EMAIL_TAKEN);
        }

        q = em.createQuery("SELECT p from Person p WHERE p.username =:username");
        q.setParameter("username", person.getUsername());
        if (q.getResultList().size() > 0) {
            throw new NotValidException(PersonSessionBeanLocal.USERNAME_TAKEN);
        }

        person.setCreatedDate(new Date());

        Ban ban = banSB.createBan();

        person.setBan(ban);
        em.persist(person);

        return person;
    } // end createPerson

    @Override
    public List<Person> searchPersonByUsername(String username) throws NoResultException, NotValidException {
        Query q;
        if (username != null) {
            q = em.createQuery("SELECT p FROM Person p WHERE " + "LOWER(p.username) LIKE :username");
            q.setParameter("username", "%" + username.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT p FROM Person p");
        }
        List<Person> personList = q.getResultList();
        for (Person p : personList) {
            p = getPersonById(p.getId());
        }

        return personList;
    } // end searchPersonByUsername

    @Override
    // Detach methods will be here
    public Person getPersonById(Long pId) throws NoResultException, NotValidException {
        Person person = emGetPerson(pId);

        em.detach(person);
        person.setPosts(null);
        person.setChats(null);
        person.setFollowers(null);
        person.setFollowing(null);
        person.setSubscriptions(null);
        person.setPublications(null);
        person.setOwnedCommunities(null);
        person.setFollowingCommunities(null);

        return person;
    } // end getPersonById

    @Override
    // Detach methods will be here
    public Person getPersonByEmail(String email) throws NoResultException, NotValidException {
        Person person = emGetPersonByEmail(email);

        em.detach(person);
        person.setPosts(null);
        person.setChats(null);
        person.setFollowers(null);
        person.setFollowing(null);
        person.setSubscriptions(null);
        person.setPublications(null);
        person.setOwnedCommunities(null);
        person.setFollowingCommunities(null);

        return person;
    } // end getPersonByEmail

    @Override
    // Detach methods will be here
    public Person getPersonByResetId(String resetId) throws NoResultException, NotValidException {
        Person person = emGetPersonByResetId(resetId);

        em.detach(person);
        person.setPosts(null);
        person.setChats(null);
        person.setFollowers(null);
        person.setFollowing(null);
        person.setSubscriptions(null);
        person.setPublications(null);
        person.setOwnedCommunities(null);
        person.setFollowingCommunities(null);

        return person;
    } // end getPersonByResetId

    @Override
    public void updatePerson(Person person) throws NoResultException, NotValidException {
        if (person == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_PERSON);
        }

        Person oldPerson = em.find(Person.class, person.getId());
        if (oldPerson != null) {
            oldPerson.setUsername(person.getUsername());
            oldPerson.setPassword(person.getPassword());
            oldPerson.setDescription(person.getDescription());
            oldPerson.setTopicInterests(person.getTopicInterests());
            oldPerson.setChatIsPaid(person.isChatIsPaid());
            oldPerson.setHasExplicitLanguage(person.isHasExplicitLanguage());
            oldPerson.setProfilePicture(person.getProfilePicture());
            oldPerson.setProfileBanner(person.getProfileBanner());
            oldPerson.setResetId(person.getResetId());
        } else {
            throw new NoResultException(PersonSessionBeanLocal.CANNOT_FIND_PERSON);
        }
    } // end updatePerson

    @Override
    public void deletePerson(Long pId) throws NoResultException, NotValidException {
        Person p = emGetPerson(pId);
        em.remove(p);
    } // end deletePerson

    public void updatePricingPlan(Person person) throws NoResultException, NotValidException {
        Person oldPerson = emGetPerson(person.getId());

        // NEED TO ADD MORE SHIT
        oldPerson.setPricingPlan(person.getPricingPlan());

    } // end updatePricingPlan

    // Get the people this person is following
    public List<Follow> getFollowing(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);

        List<Follow> following = person.getFollowing();

        for (Follow f : following) {
            em.detach(f);
            // Remove the follower (redundant)
            f.setFollower(null);

            // detaching the person entity
            Person publisher = f.getPublisher();
            f.setPublisher(getPersonById(publisher.getId()));
        }

        return following;

    }

    // Get the people following this person
    public List<Follow> getFollowers(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);

        List<Follow> followers = person.getFollowers();

        for (Follow f : followers) {
            em.detach(f);
            // Remove the publisher which is personId (redundant)
            f.setPublisher(null);

            // detaching the person entity
            Person follower = f.getFollower();
            f.setFollower(getPersonById(follower.getId()));
        }

        return followers;
    }

    @Override
    // Get the people that this person is subscribed to
    public List<Subscription> getSubscription(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);

        List<Subscription> subscriptions = person.getSubscriptions();

        for (Subscription s : subscriptions) {
            em.detach(s);
            // Remove the subscriber which is personId (redundant)
            s.setSubscriber(null);

            Person publisher = s.getPublisher();
            s.setPublisher(getPersonById(publisher.getId()));
        }

        return subscriptions;
    }

    @Override
    public List<Subscription> getPublications(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);

        List<Subscription> publications = person.getPublications();

        for (Subscription s : publications) {
            em.detach(s);
            // Remove the publisher which is personId (redundant)
            s.setPublisher(null);

            Person subscriber = s.getSubscriber();
            s.setSubscriber(getPersonById(subscriber.getId()));
        }

        return publications;
    }

    @Override
    public List<Community> getFollowingAndOwnedCommunities(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);
        List<Community> ownedCommunities = person.getOwnedCommunities();
        List<Community> followingCommunities = person.getFollowingCommunities();

        List<Community> result = new ArrayList();

        for (Community c : ownedCommunities) {
            result.add(getDetachedCommunity(c));
        }

        for (Community c : followingCommunities) {
            if (!result.contains(c)) {
                result.add(getDetachedCommunity(c));
            }
        }

        return result;

    }

    @Override
    public List<Community> getFollowingCommunities(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);
        List<Community> followingCommunities = person.getFollowingCommunities();

        List<Community> result = new ArrayList();

        for (Community c : followingCommunities) {
            result.add(getDetachedCommunity(c));
        }

        return result;
    }

    @Override
    public List<Community> getOwnedCommunities(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);
        List<Community> ownedCommunities = person.getOwnedCommunities();

        List<Community> result = new ArrayList();

        for (Community c : ownedCommunities) {
            result.add(getDetachedCommunity(c));
        }

        return result;
    }

    @Override
    public List<Post> getFollowingPosts(Long personId) throws NoResultException, NotValidException {
        List<Follow> following = getFollowing(personId);

        List<Post> results = new ArrayList();

        for (Follow f : following) {
            Person p = emGetPerson(f.getPublisher().getId());
            List<Post> posts = p.getPosts();
            results.addAll(posts);
        }

        Collections.sort(results, Collections.reverseOrder());

        List<Post> filterResults = new ArrayList();

        for (Post p : results) {
            if (p.getPostCommunity() == null) {
                filterResults.add(getDetachedPost(p));
            }
        }

        return filterResults;

    }

    @Override
    public List<Post> getPersonsPost(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);

        List<Post> posts = person.getPosts();

        List<Post> results = new ArrayList();

        for (Post p : posts) {
            if (p.getPostCommunity() == null) {
                results.add(getDetachedPost(p));
            }
        }
        return results;
    }
}
