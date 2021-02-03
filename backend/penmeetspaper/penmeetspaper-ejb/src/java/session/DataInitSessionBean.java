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
        Person masterAdmin = new Person();
        masterAdmin.setUsername("masterAdmin");
        masterAdmin.setEmail("admin@bab.com");
        masterAdmin.setPassword("yolo");
        try {
            personSB.createPerson(masterAdmin);
        } catch (NotValidException ex) {
            ex.printStackTrace();
        }
    }
}
