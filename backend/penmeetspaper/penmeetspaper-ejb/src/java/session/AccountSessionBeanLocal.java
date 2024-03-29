/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Administrator;
import entity.Person;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author carlc
 */
@Local
public interface AccountSessionBeanLocal {

    public final static String MISSING_EMAIL = "Missing person email";
    public final static String MISSING_PASSWORD = "Missing person password";
    public final static String INVALID_CREDENTIALS = "Invalid credentials";
    public final static String PERSON_BANNED_FROM_LOGIN = "Person banned from Login";

    public Person login(String email, String password) throws NoResultException, NotValidException;

    public Administrator adminLogin(String email, String password) throws NoResultException, NotValidException;

}
