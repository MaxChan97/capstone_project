/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Administrator;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
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
    public final static String MASTER_CREATED = "Master already created";

    public final static String MISSING_ADMIN_ID = "Missing Admin ID";
    public final static String CANNOT_FIND_ADMIN = "Could not find Admino";
    public final static String NO_CREDENTIALS = "No permissions for this action";
    public final static String MASTER_ADMIN_NO_DEACT = "Cannot deactivate master admin";

    public final static String DEACTIVATED = "Admin is deactivated";

    public Administrator getAdminById(Long aId) throws NoResultException, NotValidException;

    public void createMasterAdmin(Administrator admin) throws NotValidException;

    public String createAdmin(Long adminId, Administrator admin) throws NotValidException, NoResultException;

    public void deactivateAdmin(Long adminId, Long deactivateId) throws NoResultException, NotValidException;

    public List<Administrator> getAllAdmin() throws NoResultException, NotValidException;

    public void checkAdminDeactivated(Long adminId) throws NoResultException, NotValidException;

    public void banPersonFromLogin(Long adminId, Long personId, String description) throws NoResultException, NotValidException;

    public void unbanPersonFromLogin(Long adminId, Long personId, String description) throws NoResultException, NotValidException;

}
