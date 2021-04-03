/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.AdminLog;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author SHAWN LIM
 */
@Local
public interface AdminLogSessionBeanLocal {

    public static final String MISSING_ADMINLOG_ID = "Missing id parameter";
    public static final String CANNOT_FIND_ADMINLOG = "Cannot find adminLog";

    public AdminLog persistAdminLog(AdminLog al);

    public List<AdminLog> getAllAdminLogs() throws NoResultException, NotValidException;

    public AdminLog getAdminLogById(Long adminLogId) throws NoResultException, NotValidException;

    public List<AdminLog> getAdminLogByAdminId(Long adminId) throws NoResultException, NotValidException;

}
