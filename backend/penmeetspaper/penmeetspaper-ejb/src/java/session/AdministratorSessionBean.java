/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Administrator;
import exception.NoResultException;
import exception.NotValidException;
import java.util.Date;
import java.util.List;
import java.util.Random;
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

        // nullifying for marshalling done hereS
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
}
