/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.AdminLog;
import entity.Administrator;
import entity.Person;
import entity.Post;
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

    @EJB
    PostSessionBeanLocal postSB;

    @EJB
    CommentSessionBeanLocal commentSB;

    @EJB
    ReplySessionBeanLocal replySB;

    @EJB
    CommunitySessionBeanLocal CommunitySB;

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

    private Post emGetPost(Long postId) throws NoResultException, NotValidException {
        if (postId == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_POST_ID);
        }

        Post post = em.find(Post.class, postId);

        if (post == null) {
            throw new NoResultException(PostSessionBeanLocal.CANNOT_FIND_POST);
        }

        return post;
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
    public void banPersonFromLogin(Long adminId, Long personId, String description, Long reportId) throws NoResultException, NotValidException {

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

        if (reportId != null) {
            Report report = emGetReport(reportId);
            log.setReport(report);
        }

        adminLogSB.persistAdminLog(log);

        admin.getLogs().add(log);
        em.flush();

    } // end banPersonFromLogin

    @Override
    public void unbanPersonFromLogin(Long adminId, Long personId, String description, Long reportId) throws NoResultException, NotValidException {
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

        if (reportId != null) {
            Report report = emGetReport(reportId);
            log.setReport(report);
        }

        adminLogSB.persistAdminLog(log);

        admin.getLogs().add(log);
        em.flush();
    } // end unbanPersonFromLogin

    @Override
    public void deletePost(Long adminId, Long postId, String description, Long reportId) throws NoResultException, NotValidException {
        checkAdminDeactivated(adminId);

        postSB.deletePost(postId);

        Administrator admin = emGetAdmin(adminId);
        AdminLog log = new AdminLog();
        log.setAdmin(admin);
        log.setAdminLogsType(AdminLogsTypeEnum.DELETE_POST);
        Date now = new Date();
        log.setDateCreated(now);
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String strDate = dateFormat.format(now);
        String desc = String.format("%s deleted post (%o) on %s. Reason: %s", admin.getUsername(), postId, strDate, description);
        log.setDescription(desc);

        if (reportId != null) {
            Report report = emGetReport(reportId);
            log.setReport(report);
        }

        adminLogSB.persistAdminLog(log);

        admin.getLogs().add(log);
        em.flush();
    }

    @Override
    public void deleteComment(Long adminId, Long commentId, String description, Long reportId) throws NoResultException, NotValidException {
        checkAdminDeactivated(adminId);

        commentSB.deleteComment(commentId);

        Administrator admin = emGetAdmin(adminId);
        AdminLog log = new AdminLog();
        log.setAdmin(admin);
        log.setAdminLogsType(AdminLogsTypeEnum.DELETE_COMMENT);
        Date now = new Date();
        log.setDateCreated(now);
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String strDate = dateFormat.format(now);
        String desc = String.format("%s deleted comment (%o) on %s. Reason: %s", admin.getUsername(), commentId, strDate, description);
        log.setDescription(desc);

        if (reportId != null) {
            Report report = emGetReport(reportId);
            log.setReport(report);
        }

        adminLogSB.persistAdminLog(log);

        admin.getLogs().add(log);
        em.flush();
    }

    @Override
    public void deleteReply(Long adminId, Long replyId, String description, Long reportId) throws NoResultException, NotValidException {
        checkAdminDeactivated(adminId);

        replySB.deleteReply(replyId);

        Administrator admin = emGetAdmin(adminId);
        AdminLog log = new AdminLog();
        log.setAdmin(admin);
        log.setAdminLogsType(AdminLogsTypeEnum.DELETE_REPLY);
        Date now = new Date();
        log.setDateCreated(now);
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String strDate = dateFormat.format(now);
        String desc = String.format("%s deleted comment (%o) on %s. Reason: %s", admin.getUsername(), replyId, strDate, description);
        log.setDescription(desc);

        if (reportId != null) {
            Report report = emGetReport(reportId);
            log.setReport(report);
        }

        adminLogSB.persistAdminLog(log);

        admin.getLogs().add(log);
        em.flush();
    }

    @Override
    public void deleteGommunity(Long adminId, Long communityId, String description, Long reportId) throws NoResultException, NotValidException {
        checkAdminDeactivated(adminId);

        CommunitySB.deleteCommunity(communityId);

        Administrator admin = emGetAdmin(adminId);
        AdminLog log = new AdminLog();
        log.setAdmin(admin);
        log.setAdminLogsType(AdminLogsTypeEnum.DELETE_COMMUNITY);
        Date now = new Date();
        log.setDateCreated(now);
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String strDate = dateFormat.format(now);
        String desc = String.format("%s deleted community (%o) on %s. Reason: %s", admin.getUsername(), communityId, strDate, description);
        log.setDescription(desc);

        if (reportId != null) {
            Report report = emGetReport(reportId);
            log.setReport(report);
        }

        adminLogSB.persistAdminLog(log);

        admin.getLogs().add(log);
        em.flush();
    }
}
