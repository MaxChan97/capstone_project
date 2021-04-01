/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Report;
import exception.NoResultException;
import exception.NotValidException;
import java.util.Date;
import java.util.List;
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

    @Override
    public Report createReport(Report report) {
        report.setDateSubmitted(new Date());
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
