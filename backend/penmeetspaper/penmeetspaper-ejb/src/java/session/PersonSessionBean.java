/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Post;
import entity.personEntities.Person;
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
    public Person getPersonById(Long pId) throws NoResultException, NotValidException {
        Person person = emGetPerson(pId);

        em.detach(person);
        person.setPosts(null);

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
}
