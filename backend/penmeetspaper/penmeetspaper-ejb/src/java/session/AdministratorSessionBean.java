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
import exception.NoResultException;
import exception.NotValidException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;
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
public class AdministratorSessionBean implements AdministratorSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

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

    private void checkUsernameTaken(String username) throws NotValidException {
        Query q = em.createQuery("SELECT a from Administrator a WHERE a.username =:username");
        q.setParameter("username", username);
        if (q.getResultList().size() > 0) {
            throw new NotValidException(AdministratorSessionBeanLocal.USERNAME_TAKEN);
        }
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

    private void checkMasterAdmin(Administrator admin) throws NotValidException {
        if (!admin.isMaster()) {
            throw new NotValidException(AdministratorSessionBeanLocal.NO_CREDENTIALS);
        }
    }

    private boolean isMasterAdminCreated() {
        Query q = em.createQuery("SELECT a from Administrator a");
        List<Administrator> adminList = q.getResultList();
        if (adminList.isEmpty()) {
            // Master Admin cannot be deleted;
            return false;
        } else {
            return true;
        }
    }

    private String generateRandomPassword() {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 8;
        Random random = new Random();

        return random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }

    @Override
    public void createMasterAdmin(Administrator admin) throws NotValidException {
        if (isMasterAdminCreated()) {
            throw new NotValidException(AdministratorSessionBeanLocal.MASTER_CREATED);
        }

        admin.setCreatedDate(new Date());
        admin.setMaster(true);
        admin.setDeactivated(false);
        em.persist(admin);
        em.flush();

    }

    @Override
    public String createAdmin(Long adminId, Administrator admin) throws NotValidException, NoResultException {
        if (admin == null) {
            throw new NotValidException(AdministratorSessionBeanLocal.MISSING_PERSON);
        }
        if (admin.getUsername() == null) {
            throw new NotValidException(AdministratorSessionBeanLocal.MISSING_USERNAME);
        }

        Administrator a = emGetAdmin(adminId);
        checkMasterAdmin(a);

        Query q;
        q = em.createQuery("SELECT a from Administrator a WHERE a.email =:email");
        q.setParameter("email", admin.getEmail());
        if (q.getResultList().size() > 0) {
            throw new NotValidException(AdministratorSessionBeanLocal.EMAIL_TAKEN);
        }

        checkUsernameTaken(admin.getUsername());

        String password = generateRandomPassword();
        admin.setPassword(password);

        admin.setCreatedDate(new Date());

        admin.setDeactivated(false);

        admin.setMaster(false);

        em.persist(admin);
        em.flush();

        return password;
    }

    @Override
    public Administrator getAdminById(Long aId) throws NoResultException, NotValidException {
        Administrator admin = emGetAdmin(aId);
        em.detach(admin);

        em.detach(admin.getLogs());
        admin.setLogs(null);

        return admin;
    } // end getAdminById

    @Override
    public void deactivateAdmin(Long adminId, Long deactivateId) throws NoResultException, NotValidException {
        Administrator admin = emGetAdmin(adminId);
        checkMasterAdmin(admin);
        Administrator deAdmin = emGetAdmin(deactivateId);
        deAdmin.setDeactivated(true);
        em.flush();
    }

    @Override
    public List<Administrator> getAllAdmin() throws NoResultException, NotValidException {
        Query q = em.createQuery("SELECT a FROM  Administrator a");
        List<Administrator> resultList = q.getResultList();

        for (Administrator a : resultList) {
            a = getAdminById(a.getId());
        }

        return resultList;
    }

    @Override
    public void checkAdminDeactivated(Long adminId) throws NoResultException, NotValidException {
        Administrator admin = emGetAdmin(adminId);
        if (admin.isDeactivated()) {
            throw new NotValidException(AdministratorSessionBeanLocal.DEACTIVATED);
        }
    }

    @Override
    public void banPersonFromLogin(Long adminId, Long personId, String description) throws NoResultException, NotValidException {
        checkAdminDeactivated(adminId);
        personSB.banPersonFromLogin(personId);

        Administrator admin = emGetAdmin(adminId);
        Person person = personSB.getPersonById(personId);

        AdminLog log = new AdminLog();
        log.setAdmin(admin);
        log.setAdminLogsType(AdminLogsTypeEnum.BAN_USER);
        Date now = new Date();
        log.setDateCreated(now);
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String strDate = dateFormat.format(now);
        String desc = String.format("%s banned user %s (%o) on %s. Reason: %s", admin.getUsername(), person.getUsername(), person.getId(), strDate, description);
        log.setDescription(desc);
        adminLogSB.persistAdminLog(log);

        admin.getLogs().add(log);
    } // end banPersonFromLogin

    @Override
    public void unbanPersonFromLogin(Long adminId, Long personId, String description) throws NoResultException, NotValidException {
        checkAdminDeactivated(adminId);
        personSB.unbanPersonFromLogin(personId);

        Administrator admin = emGetAdmin(adminId);
        Person person = personSB.getPersonById(personId);

        AdminLog log = new AdminLog();
        log.setAdmin(admin);
        log.setAdminLogsType(AdminLogsTypeEnum.UNBAN_USER);
        Date now = new Date();
        log.setDateCreated(now);
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String strDate = dateFormat.format(now);
        String desc = String.format("%s unbanned user %s (%o) on %s. Reason: %s", admin.getUsername(), person.getUsername(), person.getId(), strDate, description);
        log.setDescription(desc);
        adminLogSB.persistAdminLog(log);

        admin.getLogs().add(log);
    } // end unbanPersonFromLogin

    @Override
    public void banPersonFromLoginReport(Long adminId, Long personId, String description, Long reportId) throws NoResultException, NotValidException {
        Report report = emGetReport(reportId);
        checkAdminDeactivated(adminId);
        personSB.banPersonFromLogin(personId);

        Administrator admin = emGetAdmin(adminId);
        Person person = personSB.getPersonById(personId);

        AdminLog log = new AdminLog();
        log.setAdmin(admin);
        log.setAdminLogsType(AdminLogsTypeEnum.BAN_USER);
        Date now = new Date();
        log.setDateCreated(now);
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String strDate = dateFormat.format(now);
        String desc = String.format("%s banned user %s (%o) on %s. Reason: %s", admin.getUsername(), person.getUsername(), person.getId(), strDate, description);
        log.setDescription(desc);
        log.setReport(report);
        adminLogSB.persistAdminLog(log);

        admin.getLogs().add(log);
        em.flush();

    } // end banPersonFromLogin

    @Override
    public void unbanPersonFromLoginReport(Long adminId, Long personId, String description, Long reportId) throws NoResultException, NotValidException {
        checkAdminDeactivated(adminId);
        Report report = emGetReport(reportId);

        personSB.unbanPersonFromLogin(personId);

        Administrator admin = emGetAdmin(adminId);
        Person person = personSB.getPersonById(personId);

        AdminLog log = new AdminLog();
        log.setAdmin(admin);
        log.setAdminLogsType(AdminLogsTypeEnum.UNBAN_USER);
        Date now = new Date();
        log.setDateCreated(now);
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String strDate = dateFormat.format(now);
        String desc = String.format("%s unbanned user %s (%o) on %s. Reason: %s", admin.getUsername(), person.getUsername(), person.getId(), strDate, description);
        log.setDescription(desc);
        log.setReport(report);
        adminLogSB.persistAdminLog(log);

        admin.getLogs().add(log);
        em.flush();
    } // end unbanPersonFromLogin

}
