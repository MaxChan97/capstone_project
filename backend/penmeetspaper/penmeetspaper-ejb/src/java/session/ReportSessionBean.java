/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.AdminLog;
import entity.Administrator;
import entity.Person;
import entity.Report;
import enumeration.AdminLogsTypeEnum;
import enumeration.ReportStateEnum;
import exception.NoResultException;
import exception.NotValidException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
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
public class ReportSessionBean implements ReportSessionBeanLocal {

    @PersistenceContext
    EntityManager em;

    @EJB
    PersonSessionBeanLocal personSB;

    @EJB
    AdminLogSessionBeanLocal adminLogSB;

    private Report emGetReport(Long reportId) throws NoResultException, NotValidException {
        if (reportId == null) {
            throw new NotValidException(ReportSessionBeanLocal.MISSING_REPORT_ID);
        }

        Report report = em.find(Report.class, reportId);

        if (report == null) {
            throw new NoResultException(ReportSessionBeanLocal.CANNOT_FIND_REPORT);
        }

        return report;
    }

    private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
        if (personId == null) {
            throw new NotValidException(ReportSessionBeanLocal.MISSING_PERSON_ID);
        }

        Person person = em.find(Person.class, personId);

        if (person == null) {
            throw new NoResultException(ReportSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        return person;
    }

    private Administrator emGetAdmin(Long adminId) throws NoResultException, NotValidException {
        if (adminId == null) {
            throw new NotValidException(AdministratorSessionBeanLocal.MISSING_ADMIN_ID);
        }

        Administrator admin = em.find(Administrator.class, adminId);

        if (admin == null) {
            throw new NoResultException(AdministratorSessionBeanLocal.CANNOT_FIND_ADMIN);
        }

        return admin;
    }

    @Override
    public Report createReport(Report report, Long reporterId) throws NoResultException, NotValidException {
        report.setReportState(ReportStateEnum.PENDING);
        report.setDateSubmitted(new Date());

        Person reporter = emGetPerson(reporterId);
        report.setReporter(reporter);
        reporter.getReports().add(report);

        em.persist(report);
        em.flush();
        return report;

    } // end createReport

    @Override
    public void updateReport(Report updatedReport) throws NoResultException, NotValidException {
        if (updatedReport == null) {
            throw new NotValidException(ReportSessionBeanLocal.MISSING_REPORT);
        }

        Report oldReport = emGetReport(updatedReport.getId());
        oldReport.setReportState(updatedReport.getReportState());

        em.flush();

    } // end updateReport

    @Override
    public Report getReportById(Long reportId) throws NoResultException, NotValidException {
        Report report = emGetReport(reportId);

        em.detach(report);

        return report;

    } // end getReportById

    @Override
    public List<Report> getAllReports() throws NoResultException, NotValidException {
        Query q = em.createQuery("SELECT a FROM  Administrator a");
        List<Report> resultList = q.getResultList();

        for (Report r : resultList) {
            r = getReportById(r.getId());
        }

        return resultList;

    } // end getAllReports

    @Override
    public void setReportState(Long reportId, ReportStateEnum state, Long adminId) throws NoResultException, NotValidException {
        Report report = emGetReport(reportId);
        report.setReportState(state);

        Date now = new Date();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String strDate = dateFormat.format(now);

        Administrator admin = emGetAdmin(adminId);
        AdminLog log = new AdminLog();
        String desc = "";
        log.setAdmin(admin);
        if (state.equals(ReportStateEnum.RESOLVED)) {
            log.setAdminLogsType(AdminLogsTypeEnum.RESOLVE_REPORT);
            desc = String.format("%s resolved report (%o) on %s.", admin.getUsername(), report.getId(), strDate);
        } else {
            log.setAdminLogsType(AdminLogsTypeEnum.VOID_REPORT);
            desc = String.format("%s voided report (%o) on %s.", admin.getUsername(), report.getId(), strDate);
        }
        log.setDateCreated(now);
        log.setDescription(desc);
        log.setReport(report);
        adminLogSB.persistAdminLog(log);

        admin.getLogs().add(log);

        em.flush();
    }
}
