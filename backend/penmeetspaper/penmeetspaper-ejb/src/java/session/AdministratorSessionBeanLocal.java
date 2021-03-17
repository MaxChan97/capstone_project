/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.adminEntities.Administrator;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author SHAWN LIM
 */
@Local
public interface AdministratorSessionBeanLocal {

    public final static String MISSING_PERSON = "Missing Administrator parameter";
    public final static String MISSING_USERNAME = "Missing Username parameter";
    public final static String USERNAME_TAKEN = "Administrator Username already taken";
    public final static String EMAIL_TAKEN = "Administrator Email already taken";

    public final static String MISSING_ADMIN_ID = "Missing Admin ID";
    public final static String CANNOT_FIND_ADMIN = "Could not find Admino";

    public Administrator createAdmin(Administrator admin) throws NotValidException;

    public Administrator getAdminById(Long aId) throws NoResultException, NotValidException;

}