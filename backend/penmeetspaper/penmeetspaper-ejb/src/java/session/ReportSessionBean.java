/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Person;
import entity.Report;
import enumeration.ReportStateEnum;
import exception.NoResultException;
import exception.NotValidException;
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

    @Override
    public Report createReport(Report report, Long reporterId) throws NoResultException, NotValidException {
        report.setReportState(ReportStateEnum.PENDING);
        report.setDateSubmitted(new Date());

        Person reporter = emGetPerson(reporterId);

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
}
