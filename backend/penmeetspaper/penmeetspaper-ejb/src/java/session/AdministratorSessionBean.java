/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.adminEntities.Administrator;
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

    public Administrator createAdmin(Administrator admin) throws NotValidException {
        if (admin == null) {
            throw new NotValidException(AdministratorSessionBeanLocal.MISSING_PERSON);
        }
        if (admin.getUsername() == null) {
            throw new NotValidException(AdministratorSessionBeanLocal.MISSING_USERNAME);
        }

        Query q;
        q = em.createQuery("SELECT a from Administrator a WHERE a.email =:email");
        q.setParameter("email", admin.getEmail());
        if (q.getResultList().size() > 0) {
            throw new NotValidException(AdministratorSessionBeanLocal.EMAIL_TAKEN);
        }

        checkUsernameTaken(admin.getUsername());

        admin.setCreatedDate(new Date());

        admin.setIsDeactivated(false);

        if (isMasterAdminCreated()) {
            admin.setIsMaster(false);
        } else {
            admin.setIsMaster(true);
        }

        em.persist(admin);
        em.flush();

        return admin;
    }

    @Override
    public Administrator getAdminById(Long aId) throws NoResultException, NotValidException {
        Administrator admin = emGetAdmin(aId);
        em.detach(admin);

        // nullifying for marshalling done hereS
        return admin;
    }
}
