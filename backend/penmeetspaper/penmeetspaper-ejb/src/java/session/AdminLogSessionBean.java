/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.AdminLog;
import exception.NoResultException;
import exception.NotValidException;
import java.util.Date;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author SHAWN LIM
 */
@Stateless
public class AdminLogSessionBean implements AdminLogSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    private AdminLog emGetAdminLog(Long adminLogId) throws NoResultException, NotValidException {
        if (adminLogId == null) {
            throw new NotValidException(AdminLogSessionBeanLocal.MISSING_ADMINLOG_ID);
        }

        AdminLog report = em.find(AdminLog.class, adminLogId);

        if (report == null) {
            throw new NoResultException(AdminLogSessionBeanLocal.CANNOT_FIND_ADMINLOG);
        }

        return report;
    }

    public AdminLog createAdminLog(AdminLog al) {
        al.setDateCreated(new Date());

        em.persist(al);
        em.flush();

        return al;
    }
}
