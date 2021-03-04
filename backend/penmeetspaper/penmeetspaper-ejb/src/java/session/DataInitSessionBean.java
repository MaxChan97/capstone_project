/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.personEntities.Person;
import exception.NoResultException;
import exception.NotValidException;
import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Singleton;
import javax.ejb.Startup;

/**
 *
 * @author Shawn
 */
@Singleton
@LocalBean
@Startup
public class DataInitSessionBean {

    @EJB
    private PersonSessionBeanLocal personSB;

    public DataInitSessionBean() {
    }

    @PostConstruct
    public void postConstruct() {
        try {
            personSB.getPersonById(new Long(1));
        } catch (NoResultException | NotValidException ex) {
            initData();
        }
    }

    private void initData() {
        Person user1 = new Person();
        user1.setUsername("user1");
        user1.setEmail("user1@email.com");
        user1.setPassword("password");

        Person user2 = new Person();
        user2.setUsername("user2");
        user2.setEmail("user2@email.com");
        user2.setPassword("password");

        Person user3 = new Person();
        user3.setUsername("user3");
        user3.setEmail("user3@email.com");
        user3.setPassword("password");

        Person user4 = new Person();
        user4.setUsername("user4");
        user4.setEmail("user4@email.com");
        user4.setPassword("password");

        Person user5 = new Person();
        user5.setUsername("user5");
        user5.setEmail("user5@email.com");
        user5.setPassword("password");

        Person user6 = new Person();
        user6.setUsername("user6");
        user6.setEmail("user6@email.com");
        user6.setPassword("password");

        Person user7 = new Person();
        user7.setUsername("user7");
        user7.setEmail("user7@email.com");
        user7.setPassword("password");

        try {
            personSB.createPerson(user1);
            personSB.createPerson(user2);
            personSB.createPerson(user3);
            personSB.createPerson(user4);
            personSB.createPerson(user5);
            personSB.createPerson(user6);
            personSB.createPerson(user7);
        } catch (NotValidException ex) {
            ex.printStackTrace();
        }
    }
}
