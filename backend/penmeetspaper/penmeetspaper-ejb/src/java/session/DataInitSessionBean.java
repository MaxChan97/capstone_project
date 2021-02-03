/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Person;
import exception.NoResultException;
import exception.NotValidException;
import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.ejb.LocalBean;
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
        Person temp = new Person();
        temp.setUsername("user1");
        temp.setEmail("user1@bab.com");
        temp.setPassword("password");
        try {
            personSB.createPerson(temp);
        } catch (NotValidException ex) {
            ex.printStackTrace();
        }
    }
}
