/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Report;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author SHAWN LIM
 */
@Local
public interface ReportSessionBeanLocal {

    public final static String MISSING_REPORT_ID = "Missing report Id";
    public final static String MISSING_PERSON_ID = "Missing person ID";

    public final static String CANNOT_FIND_PERSON = "Could not find person";
    public final static String CANNOT_FIND_REPORT = "Cannot find report";
    public final static String MISSING_REPORT = "Missing report parameter";

    public void updateReport(Report updatedReport) throws NoResultException, NotValidException;

    public Report getReportById(Long reportId) throws NoResultException, NotValidException;

    public List<Report> getAllReports() throws NoResultException, NotValidException;

    public Report createReport(Report report, Long reporterId) throws NoResultException, NotValidException;

}
