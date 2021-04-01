/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import javax.ejb.Local;

/**
 *
 * @author SHAWN LIM
 */
@Local
public interface AdminLogSessionBeanLocal {

    public static final String MISSING_ADMINLOG_ID = "Missing id parameter";
    public static final String CANNOT_FIND_ADMINLOG = "Cannot find adminLog";

}
