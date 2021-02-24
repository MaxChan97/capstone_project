/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.personEntities.Person;
import entity.personToPersonEntities.Follow;
import entity.personToPersonEntities.Subscription;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
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

        em.persist(person);

        return person;
    } //end createPerson

    @Override
    public List<Person> searchPersonByUsername(String username) {
        Query q;
        if (username != null) {
            q = em.createQuery("SELECT p FROM Person p WHERE "
                    + "LOWER(p.username) LIKE :username");
            q.setParameter("username", "%" + username.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT p FROM Person p");
        }
        return q.getResultList();
    } //end searchPersonByUsername

    @Override
    // Detach methods will be here
    public Person getPersonById(Long pId) throws NoResultException, NotValidException {
        Person person = emGetPerson(pId);

        em.detach(person);
        person.setPosts(null);
        person.setFollowers(null);
        person.setFollowing(null);
        person.setSubscriptions(null);
        person.setPublications(null);

        return person;
    } //end getPersonById

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
        } else {
            throw new NoResultException(PersonSessionBeanLocal.CANNOT_FIND_PERSON);
        }
    } //end updatePerson

    @Override
    public void deletePerson(Long pId) throws NoResultException, NotValidException {
        Person p = emGetPerson(pId);
        em.remove(p);
    } //end deletePerson

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
}
