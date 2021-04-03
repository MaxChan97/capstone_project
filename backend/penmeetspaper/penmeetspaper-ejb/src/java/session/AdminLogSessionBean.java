/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.AdminLog;
import entity.Administrator;
import entity.Report;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author SHAWN LIM
 */
@Stateless
public class AdminLogSessionBean implements AdminLogSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @EJB
    AdministratorSessionBeanLocal adminSB;

    @EJB
    ReportSessionBeanLocal reportSB;

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

    private Administrator getDetachedAdmin(Administrator a) throws NoResultException, NotValidException {
        return adminSB.getAdminById(a.getId());
    }

    private Report getDetachedReportForAdminLog(Report r) throws NoResultException, NotValidException {
        Report report = reportSB.getReportById(r.getId());
        report.setReporter(null);
        return report;
    }

    @Override
    public AdminLog persistAdminLog(AdminLog al) {

        em.persist(al);
        em.flush();

        return al;
    }

    public AdminLog getAdminLogById(Long adminLogId) throws NoResultException, NotValidException {
        AdminLog a = emGetAdminLog(adminLogId);
        em.detach(a);
        em.detach(a.getAdmin());

        Administrator admin = a.getAdmin();
        a.setAdmin(getDetachedAdmin(admin));

        Report r = a.getReport();

        if (r != null) {
            em.detach(r);
            a.setReport(getDetachedReportForAdminLog(r));
        }

        return a;

    }

    public List<AdminLog> getAllAdminLogs() throws NoResultException, NotValidException {
        Query q = em.createQuery("SELECT a FROM  AdminLog a");
        List<AdminLog> resultList = q.getResultList();

        for (AdminLog a : resultList) {
            a = getAdminLogById(a.getId());
        }

        return resultList;
    }
}
