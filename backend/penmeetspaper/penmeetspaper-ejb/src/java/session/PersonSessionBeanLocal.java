/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.personEntities.Person;
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
    public final static String MISSING_PERSON = "Missing person parameter";
    public final static String EMAIL_TAKEN = "Email taken";
    public final static String USERNAME_TAKEN = "Username taken";

    public Person createPerson(Person person) throws NotValidException;

    public List<Person> searchPersonByUsername(String username);

    public Person getPersonById(Long pId) throws NoResultException, NotValidException;

    public void updatePerson(Person person) throws NoResultException, NotValidException;

    public void deletePerson(Long id) throws NoResultException, NotValidException;

    public void updatePricingPlan(Person person) throws NoResultException, NotValidException;

}
